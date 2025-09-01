// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./FHESecurityLayer.sol";

/**
 * @title Confidential Exchange
 * @dev Privacy-preserving decentralized exchange with FHE-protected trading
 * @author CryptoFund Nexus Team
 */
contract ConfidentialExchange is ReentrancyGuard, AccessControl, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant MARKET_MAKER_ROLE = keccak256("MARKET_MAKER_ROLE");

    FHESecurityLayer public immutable fheLayer;

    enum OrderType {
        BUY,
        SELL
    }

    enum OrderStatus {
        PENDING,
        PARTIALLY_FILLED,
        FILLED,
        CANCELLED,
        EXPIRED
    }

    struct TradingPair {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        uint256 swapFee; // in basis points (100 = 1%)
        bool isActive;
        bool isConfidential;
    }

    struct ConfidentialOrder {
        uint256 orderId;
        address trader;
        address tokenIn;
        address tokenOut;
        bytes32 encryptedAmountIn;
        bytes32 encryptedAmountOut;
        bytes32 encryptedPrice;
        OrderType orderType;
        OrderStatus status;
        uint256 timestamp;
        uint256 expiry;
        bool isMarketOrder;
        bytes32 nonce;
    }

    struct LiquidityPosition {
        uint256 positionId;
        address provider;
        address tokenA;
        address tokenB;
        bytes32 encryptedAmountA;
        bytes32 encryptedAmountB;
        bytes32 encryptedLiquidityTokens;
        uint256 timestamp;
        bool isActive;
    }

    struct TradeExecution {
        uint256 orderId1;
        uint256 orderId2;
        bytes32 encryptedExecutedAmount;
        bytes32 encryptedPrice;
        uint256 timestamp;
        bytes32 executionHash;
    }

    mapping(bytes32 => TradingPair) public tradingPairs;
    mapping(uint256 => ConfidentialOrder) public orders;
    mapping(uint256 => LiquidityPosition) public liquidityPositions;
    mapping(address => uint256[]) public userOrders;
    mapping(address => uint256[]) public userLiquidityPositions;
    mapping(bytes32 => TradeExecution[]) public pairTradeHistory;
    mapping(address => mapping(address => uint256)) public userBalances;
    mapping(bytes32 => bool) public usedNonces;

    uint256 private orderCounter;
    uint256 private liquidityPositionCounter;
    uint256 public protocolFeeRate = 30; // 0.3%
    uint256 public constant MAX_FEE_RATE = 1000; // 10%
    address public feeCollector;

    // AMM parameters
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    uint256 public slippageTolerance = 300; // 3%

    event TradingPairCreated(
        bytes32 indexed pairId,
        address indexed tokenA,
        address indexed tokenB,
        uint256 swapFee,
        bool isConfidential
    );

    event ConfidentialOrderCreated(
        uint256 indexed orderId,
        address indexed trader,
        address tokenIn,
        address tokenOut,
        OrderType orderType,
        bytes32 encryptedAmountIn
    );

    event ConfidentialOrderExecuted(
        uint256 indexed orderId,
        bytes32 encryptedExecutedAmount,
        bytes32 encryptedPrice
    );

    event LiquidityAdded(
        uint256 indexed positionId,
        address indexed provider,
        bytes32 indexed pairId,
        bytes32 encryptedAmountA,
        bytes32 encryptedAmountB
    );

    event LiquidityRemoved(
        uint256 indexed positionId,
        address indexed provider,
        bytes32 indexed pairId,
        bytes32 encryptedAmountA,
        bytes32 encryptedAmountB
    );

    event ConfidentialSwapExecuted(
        address indexed trader,
        bytes32 indexed pairId,
        bytes32 encryptedAmountIn,
        bytes32 encryptedAmountOut
    );

    constructor(address _fheLayer, address _feeCollector) {
        fheLayer = FHESecurityLayer(_fheLayer);
        feeCollector = _feeCollector;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    modifier validPair(bytes32 pairId) {
        require(tradingPairs[pairId].isActive, "ConfidentialExchange: Invalid trading pair");
        _;
    }

    modifier orderExists(uint256 orderId) {
        require(orderId <= orderCounter && orderId > 0, "ConfidentialExchange: Order does not exist");
        _;
    }

    modifier onlyOrderOwner(uint256 orderId) {
        require(orders[orderId].trader == msg.sender, "ConfidentialExchange: Not order owner");
        _;
    }

    function createTradingPair(
        address tokenA,
        address tokenB,
        uint256 swapFee,
        bool isConfidential
    ) external onlyRole(ADMIN_ROLE) returns (bytes32) {
        require(tokenA != tokenB, "ConfidentialExchange: Identical tokens");
        require(tokenA != address(0) && tokenB != address(0), "ConfidentialExchange: Zero address");
        require(swapFee <= MAX_FEE_RATE, "ConfidentialExchange: Fee too high");

        // Ensure consistent pair ordering
        if (tokenA > tokenB) {
            (tokenA, tokenB) = (tokenB, tokenA);
        }

        bytes32 pairId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(!tradingPairs[pairId].isActive, "ConfidentialExchange: Pair already exists");

        tradingPairs[pairId] = TradingPair({
            tokenA: tokenA,
            tokenB: tokenB,
            reserveA: 0,
            reserveB: 0,
            totalLiquidity: 0,
            swapFee: swapFee,
            isActive: true,
            isConfidential: isConfidential
        });

        emit TradingPairCreated(pairId, tokenA, tokenB, swapFee, isConfidential);
        return pairId;
    }

    function createConfidentialOrder(
        address tokenIn,
        address tokenOut,
        bytes32 encryptedAmountIn,
        bytes32 encryptedAmountOut,
        bytes32 encryptedPrice,
        OrderType orderType,
        uint256 expiry,
        bool isMarketOrder,
        bytes32 nonce,
        bytes calldata proof
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(!usedNonces[nonce], "ConfidentialExchange: Nonce already used");
        require(expiry > block.timestamp, "ConfidentialExchange: Invalid expiry");
        require(tokenIn != tokenOut, "ConfidentialExchange: Same token");

        bytes32 pairId = _getPairId(tokenIn, tokenOut);
        require(tradingPairs[pairId].isActive, "ConfidentialExchange: Pair not active");

        // Verify FHE proof
        require(
            fheLayer.verifyInvestmentProof(encryptedAmountIn, proof, 0),
            "ConfidentialExchange: Invalid FHE proof"
        );

        orderCounter++;
        uint256 orderId = orderCounter;

        orders[orderId] = ConfidentialOrder({
            orderId: orderId,
            trader: msg.sender,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            encryptedAmountIn: encryptedAmountIn,
            encryptedAmountOut: encryptedAmountOut,
            encryptedPrice: encryptedPrice,
            orderType: orderType,
            status: OrderStatus.PENDING,
            timestamp: block.timestamp,
            expiry: expiry,
            isMarketOrder: isMarketOrder,
            nonce: nonce
        });

        userOrders[msg.sender].push(orderId);
        usedNonces[nonce] = true;

        emit ConfidentialOrderCreated(
            orderId,
            msg.sender,
            tokenIn,
            tokenOut,
            orderType,
            encryptedAmountIn
        );

        // Auto-execute if market order
        if (isMarketOrder) {
            _executeMarketOrder(orderId);
        }

        return orderId;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        bytes32 encryptedAmountA,
        bytes32 encryptedAmountB,
        bytes calldata proofA,
        bytes calldata proofB
    ) external whenNotPaused nonReentrant returns (uint256) {
        bytes32 pairId = _getPairId(tokenA, tokenB);
        require(tradingPairs[pairId].isActive, "ConfidentialExchange: Pair not active");

        // Verify FHE proofs
        require(
            fheLayer.verifyInvestmentProof(encryptedAmountA, proofA, 0) &&
            fheLayer.verifyInvestmentProof(encryptedAmountB, proofB, 0),
            "ConfidentialExchange: Invalid FHE proofs"
        );

        liquidityPositionCounter++;
        uint256 positionId = liquidityPositionCounter;

        // Calculate liquidity tokens (simplified for demo)
        bytes32 encryptedLiquidityTokens = fheLayer.homomorphicAdd(
            encryptedAmountA,
            encryptedAmountB
        );

        liquidityPositions[positionId] = LiquidityPosition({
            positionId: positionId,
            provider: msg.sender,
            tokenA: tokenA,
            tokenB: tokenB,
            encryptedAmountA: encryptedAmountA,
            encryptedAmountB: encryptedAmountB,
            encryptedLiquidityTokens: encryptedLiquidityTokens,
            timestamp: block.timestamp,
            isActive: true
        });

        userLiquidityPositions[msg.sender].push(positionId);

        // Update reserves (simplified)
        tradingPairs[pairId].totalLiquidity += 1; // Placeholder

        emit LiquidityAdded(
            positionId,
            msg.sender,
            pairId,
            encryptedAmountA,
            encryptedAmountB
        );

        return positionId;
    }

    function removeLiquidity(
        uint256 positionId
    ) external nonReentrant {
        require(positionId <= liquidityPositionCounter && positionId > 0, "ConfidentialExchange: Invalid position");
        
        LiquidityPosition storage position = liquidityPositions[positionId];
        require(position.provider == msg.sender, "ConfidentialExchange: Not position owner");
        require(position.isActive, "ConfidentialExchange: Position not active");

        position.isActive = false;

        bytes32 pairId = _getPairId(position.tokenA, position.tokenB);
        tradingPairs[pairId].totalLiquidity -= 1; // Placeholder

        emit LiquidityRemoved(
            positionId,
            msg.sender,
            pairId,
            position.encryptedAmountA,
            position.encryptedAmountB
        );
    }

    function executeConfidentialSwap(
        address tokenIn,
        address tokenOut,
        bytes32 encryptedAmountIn,
        bytes32 encryptedMinAmountOut,
        bytes calldata proof
    ) external whenNotPaused nonReentrant returns (bytes32) {
        bytes32 pairId = _getPairId(tokenIn, tokenOut);
        require(tradingPairs[pairId].isActive, "ConfidentialExchange: Pair not active");
        require(tradingPairs[pairId].isConfidential, "ConfidentialExchange: Pair not confidential");

        // Verify FHE proof
        require(
            fheLayer.verifyInvestmentProof(encryptedAmountIn, proof, 0),
            "ConfidentialExchange: Invalid FHE proof"
        );

        // Calculate output amount using AMM formula (simplified)
        bytes32 encryptedAmountOut = _calculateSwapOutput(
            pairId,
            tokenIn,
            encryptedAmountIn
        );

        // Verify slippage protection
        require(
            _verifyMinOutput(encryptedAmountOut, encryptedMinAmountOut),
            "ConfidentialExchange: Insufficient output amount"
        );

        // Update reserves (simplified)
        tradingPairs[pairId].reserveA += 1; // Placeholder
        tradingPairs[pairId].reserveB += 1; // Placeholder

        emit ConfidentialSwapExecuted(
            msg.sender,
            pairId,
            encryptedAmountIn,
            encryptedAmountOut
        );

        return encryptedAmountOut;
    }

    function cancelOrder(uint256 orderId)
        external
        orderExists(orderId)
        onlyOrderOwner(orderId)
    {
        ConfidentialOrder storage order = orders[orderId];
        require(order.status == OrderStatus.PENDING, "ConfidentialExchange: Order not pending");

        order.status = OrderStatus.CANCELLED;
    }

    function _executeMarketOrder(uint256 orderId) internal {
        ConfidentialOrder storage order = orders[orderId];
        
        // Find matching orders (simplified)
        uint256[] storage userOrderList = userOrders[order.trader];
        
        if (userOrderList.length > 1) {
            // Execute against another order (simplified)
            order.status = OrderStatus.FILLED;
            
            emit ConfidentialOrderExecuted(
                orderId,
                order.encryptedAmountIn,
                order.encryptedPrice
            );
        }
    }

    function _calculateSwapOutput(
        bytes32 pairId,
        address tokenIn,
        bytes32 encryptedAmountIn
    ) internal view returns (bytes32) {
        // Simplified AMM calculation with FHE
        // In production, implement proper constant product formula
        return fheLayer.homomorphicAdd(encryptedAmountIn, bytes32(uint256(1)));
    }

    function _verifyMinOutput(
        bytes32 encryptedAmountOut,
        bytes32 encryptedMinAmountOut
    ) internal view returns (bool) {
        // Simplified comparison
        // In production, use FHE comparison operations
        return encryptedAmountOut != bytes32(0) && encryptedMinAmountOut != bytes32(0);
    }

    function _getPairId(address tokenA, address tokenB) internal pure returns (bytes32) {
        if (tokenA > tokenB) {
            (tokenA, tokenB) = (tokenB, tokenA);
        }
        return keccak256(abi.encodePacked(tokenA, tokenB));
    }

    // View functions
    function getTradingPair(bytes32 pairId) external view returns (TradingPair memory) {
        return tradingPairs[pairId];
    }

    function getOrder(uint256 orderId) external view returns (ConfidentialOrder memory) {
        return orders[orderId];
    }

    function getUserOrders(address user) external view returns (uint256[] memory) {
        return userOrders[user];
    }

    function getUserLiquidityPositions(address user) external view returns (uint256[] memory) {
        return userLiquidityPositions[user];
    }

    function getLiquidityPosition(uint256 positionId) external view returns (LiquidityPosition memory) {
        return liquidityPositions[positionId];
    }

    function getTradeHistory(bytes32 pairId) external view returns (TradeExecution[] memory) {
        return pairTradeHistory[pairId];
    }

    function getTotalOrders() external view returns (uint256) {
        return orderCounter;
    }

    function getTotalLiquidityPositions() external view returns (uint256) {
        return liquidityPositionCounter;
    }

    // Admin functions
    function setProtocolFeeRate(uint256 newRate) external onlyRole(ADMIN_ROLE) {
        require(newRate <= MAX_FEE_RATE, "ConfidentialExchange: Fee too high");
        protocolFeeRate = newRate;
    }

    function setSlippageTolerance(uint256 newTolerance) external onlyRole(ADMIN_ROLE) {
        require(newTolerance <= 1000, "ConfidentialExchange: Tolerance too high"); // Max 10%
        slippageTolerance = newTolerance;
    }

    function setFeeCollector(address newCollector) external onlyRole(ADMIN_ROLE) {
        require(newCollector != address(0), "ConfidentialExchange: Invalid address");
        feeCollector = newCollector;
    }

    function pauseTradingPair(bytes32 pairId) external onlyRole(ADMIN_ROLE) validPair(pairId) {
        tradingPairs[pairId].isActive = false;
    }

    function unpauseTradingPair(bytes32 pairId) external onlyRole(ADMIN_ROLE) {
        tradingPairs[pairId].isActive = true;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function emergencyWithdraw(address token, uint256 amount)
        external
        onlyRole(ADMIN_ROLE)
    {
        IERC20(token).safeTransfer(msg.sender, amount);
    }
}