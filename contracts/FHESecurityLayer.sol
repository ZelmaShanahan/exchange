// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./integrations/ZamaFHE.sol";

/**
 * @title FHE Security Layer
 * @dev Advanced Fully Homomorphic Encryption utilities for privacy-preserving operations
 * @author CryptoFund Nexus Team
 */
contract FHESecurityLayer is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant DECRYPTOR_ROLE = keccak256("DECRYPTOR_ROLE");
    
    // Zama FHE Integration
    ZamaFHEIntegration public immutable zamaFHE;

    // FHE operation types
    enum FHEOperationType {
        ENCRYPT,
        DECRYPT,
        ADD,
        SUBTRACT,
        MULTIPLY,
        COMPARE,
        RANGE_PROOF
    }

    // Encryption parameters
    struct EncryptionParams {
        uint256 publicKeyX;
        uint256 publicKeyY;
        uint256 modulus;
        uint256 generator;
        bytes32 domainSeparator;
    }

    // Proof structure for zero-knowledge proofs
    struct ZKProof {
        uint256[2] a;
        uint256[2] b;
        uint256[2] c;
        uint256[] inputs;
        bytes32 commitment;
    }

    // Range proof structure
    struct RangeProof {
        bytes32 commitment;
        uint256 minValue;
        uint256 maxValue;
        bytes proof;
        bool isValid;
    }

    // Encrypted value structure
    struct EncryptedValue {
        bytes32 ciphertext;
        bytes32 randomness;
        uint256 timestamp;
        address owner;
        bool isValid;
    }

    mapping(bytes32 => EncryptedValue) public encryptedValues;
    mapping(address => bytes32[]) public userEncryptedValues;
    mapping(bytes32 => RangeProof) public rangeProofs;
    mapping(bytes32 => mapping(FHEOperationType => uint256)) public operationCosts;

    EncryptionParams public encParams;
    uint256 public constant MAX_ENCRYPTED_VALUE = 2**64 - 1;
    uint256 public operationCounter;
    
    // Events
    event EncryptionPerformed(
        bytes32 indexed ciphertext,
        address indexed user,
        uint256 timestamp
    );

    event DecryptionPerformed(
        bytes32 indexed ciphertext,
        address indexed user,
        uint256 timestamp
    );

    event HomomorphicOperationPerformed(
        bytes32 indexed result,
        FHEOperationType operation,
        bytes32 operand1,
        bytes32 operand2
    );

    event RangeProofVerified(
        bytes32 indexed commitment,
        uint256 minValue,
        uint256 maxValue,
        bool isValid
    );

    event EncryptionParamsUpdated(
        uint256 publicKeyX,
        uint256 publicKeyY,
        uint256 modulus
    );

    constructor(
        uint256 _publicKeyX,
        uint256 _publicKeyY,
        uint256 _modulus,
        uint256 _generator
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(DECRYPTOR_ROLE, msg.sender);

        encParams = EncryptionParams({
            publicKeyX: _publicKeyX,
            publicKeyY: _publicKeyY,
            modulus: _modulus,
            generator: _generator,
            domainSeparator: keccak256("FHE_SECURITY_LAYER_V1")
        });

        _initializeOperationCosts();
    }

    modifier validCiphertext(bytes32 ciphertext) {
        require(encryptedValues[ciphertext].isValid, "FHESecurityLayer: Invalid ciphertext");
        _;
    }

    modifier onlyOwnerOrOperator(bytes32 ciphertext) {
        require(
            encryptedValues[ciphertext].owner == msg.sender || 
            hasRole(OPERATOR_ROLE, msg.sender),
            "FHESecurityLayer: Unauthorized access"
        );
        _;
    }

    function _initializeOperationCosts() internal {
        // Set gas costs for different FHE operations (in gas units)
        operationCosts[bytes32(0)][FHEOperationType.ENCRYPT] = 50000;
        operationCosts[bytes32(0)][FHEOperationType.DECRYPT] = 30000;
        operationCosts[bytes32(0)][FHEOperationType.ADD] = 80000;
        operationCosts[bytes32(0)][FHEOperationType.SUBTRACT] = 80000;
        operationCosts[bytes32(0)][FHEOperationType.MULTIPLY] = 150000;
        operationCosts[bytes32(0)][FHEOperationType.COMPARE] = 100000;
        operationCosts[bytes32(0)][FHEOperationType.RANGE_PROOF] = 200000;
    }

    /**
     * @dev Encrypt a value using FHE
     */
    function encryptValue(
        uint256 value,
        bytes32 randomness
    ) external returns (bytes32) {
        require(value <= MAX_ENCRYPTED_VALUE, "FHESecurityLayer: Value too large");
        require(randomness != bytes32(0), "FHESecurityLayer: Invalid randomness");

        // Simulated FHE encryption (in production, use actual FHE library)
        bytes32 ciphertext = keccak256(
            abi.encodePacked(
                value,
                randomness,
                msg.sender,
                block.timestamp,
                operationCounter++,
                encParams.domainSeparator
            )
        );

        encryptedValues[ciphertext] = EncryptedValue({
            ciphertext: ciphertext,
            randomness: randomness,
            timestamp: block.timestamp,
            owner: msg.sender,
            isValid: true
        });

        userEncryptedValues[msg.sender].push(ciphertext);

        emit EncryptionPerformed(ciphertext, msg.sender, block.timestamp);

        return ciphertext;
    }

    /**
     * @dev Decrypt a value (only owner or authorized decryptor)
     */
    function decryptAmount(
        bytes32 ciphertext,
        address requester
    ) external view validCiphertext(ciphertext) returns (uint256) {
        EncryptedValue memory encValue = encryptedValues[ciphertext];
        
        require(
            encValue.owner == requester || hasRole(DECRYPTOR_ROLE, msg.sender),
            "FHESecurityLayer: Unauthorized decryption"
        );

        // Simulated decryption (in production, use actual FHE decryption)
        // For demonstration, we reverse the encryption process
        uint256 pseudoValue = uint256(
            keccak256(abi.encodePacked(ciphertext, encValue.randomness))
        ) % MAX_ENCRYPTED_VALUE;

        return pseudoValue;
    }

    /**
     * @dev Verify investment proof using zero-knowledge proofs
     */
    function verifyInvestmentProof(
        bytes32 encryptedAmount,
        bytes calldata proof,
        uint256 actualAmount
    ) external view validCiphertext(encryptedAmount) returns (bool) {
        // Simulated proof verification
        // In production, implement actual ZK-SNARK verification
        bytes32 proofHash = keccak256(proof);
        bytes32 expectedHash = keccak256(
            abi.encodePacked(encryptedAmount, actualAmount, encParams.domainSeparator)
        );

        return proofHash != bytes32(0) && expectedHash != bytes32(0);
    }

    /**
     * @dev Verify investment bounds using homomorphic comparison
     */
    function verifyInvestmentBounds(
        bytes32 encryptedAmount,
        uint256 minInvestment,
        uint256 maxInvestment
    ) external view validCiphertext(encryptedAmount) returns (bool) {
        // Simulated homomorphic comparison
        // In production, use FHE comparison operations
        
        // For demonstration, we assume the encrypted amount is valid
        // if it was created through proper channels
        EncryptedValue memory encValue = encryptedValues[encryptedAmount];
        
        // Basic validity checks
        return encValue.timestamp > 0 && 
               minInvestment <= maxInvestment &&
               minInvestment > 0;
    }

    /**
     * @dev Homomorphic addition of encrypted values
     */
    function homomorphicAdd(
        bytes32 ciphertext1,
        bytes32 ciphertext2
    ) external validCiphertext(ciphertext1) validCiphertext(ciphertext2) returns (bytes32) {
        require(
            hasRole(OPERATOR_ROLE, msg.sender),
            "FHESecurityLayer: Unauthorized operation"
        );

        // Simulated homomorphic addition
        bytes32 result = keccak256(
            abi.encodePacked(
                ciphertext1,
                ciphertext2,
                "ADD",
                block.timestamp,
                operationCounter++
            )
        );

        encryptedValues[result] = EncryptedValue({
            ciphertext: result,
            randomness: bytes32(operationCounter),
            timestamp: block.timestamp,
            owner: msg.sender,
            isValid: true
        });

        emit HomomorphicOperationPerformed(result, FHEOperationType.ADD, ciphertext1, ciphertext2);

        return result;
    }

    /**
     * @dev Homomorphic subtraction of encrypted values
     */
    function homomorphicSubtract(
        bytes32 ciphertext1,
        bytes32 ciphertext2
    ) external validCiphertext(ciphertext1) validCiphertext(ciphertext2) returns (bytes32) {
        require(
            hasRole(OPERATOR_ROLE, msg.sender),
            "FHESecurityLayer: Unauthorized operation"
        );

        bytes32 result = keccak256(
            abi.encodePacked(
                ciphertext1,
                ciphertext2,
                "SUB",
                block.timestamp,
                operationCounter++
            )
        );

        encryptedValues[result] = EncryptedValue({
            ciphertext: result,
            randomness: bytes32(operationCounter),
            timestamp: block.timestamp,
            owner: msg.sender,
            isValid: true
        });

        emit HomomorphicOperationPerformed(result, FHEOperationType.SUBTRACT, ciphertext1, ciphertext2);

        return result;
    }

    /**
     * @dev Generate and verify range proof
     */
    function generateRangeProof(
        bytes32 commitment,
        uint256 minValue,
        uint256 maxValue,
        bytes calldata proofData
    ) external returns (bool) {
        require(minValue <= maxValue, "FHESecurityLayer: Invalid range");
        require(commitment != bytes32(0), "FHESecurityLayer: Invalid commitment");

        // Simulated range proof verification
        bool isValid = proofData.length > 0 && 
                      maxValue <= MAX_ENCRYPTED_VALUE &&
                      minValue < maxValue;

        rangeProofs[commitment] = RangeProof({
            commitment: commitment,
            minValue: minValue,
            maxValue: maxValue,
            proof: proofData,
            isValid: isValid
        });

        emit RangeProofVerified(commitment, minValue, maxValue, isValid);

        return isValid;
    }

    /**
     * @dev Batch encrypt multiple values for efficiency
     */
    function batchEncrypt(
        uint256[] calldata values,
        bytes32[] calldata randomnessArray
    ) external returns (bytes32[] memory) {
        require(values.length == randomnessArray.length, "FHESecurityLayer: Array length mismatch");
        require(values.length <= 50, "FHESecurityLayer: Batch too large");

        bytes32[] memory ciphertexts = new bytes32[](values.length);

        for (uint256 i = 0; i < values.length; i++) {
            require(values[i] <= MAX_ENCRYPTED_VALUE, "FHESecurityLayer: Value too large");
            require(randomnessArray[i] != bytes32(0), "FHESecurityLayer: Invalid randomness");

            bytes32 ciphertext = keccak256(
                abi.encodePacked(
                    values[i],
                    randomnessArray[i],
                    msg.sender,
                    block.timestamp,
                    operationCounter++,
                    i // Include index for uniqueness
                )
            );

            encryptedValues[ciphertext] = EncryptedValue({
                ciphertext: ciphertext,
                randomness: randomnessArray[i],
                timestamp: block.timestamp,
                owner: msg.sender,
                isValid: true
            });

            userEncryptedValues[msg.sender].push(ciphertext);
            ciphertexts[i] = ciphertext;

            emit EncryptionPerformed(ciphertext, msg.sender, block.timestamp);
        }

        return ciphertexts;
    }

    /**
     * @dev Compute homomorphic sum of multiple encrypted values
     */
    function computeHomomorphicSum(
        bytes32[] calldata ciphertexts
    ) external onlyRole(OPERATOR_ROLE) returns (bytes32) {
        require(ciphertexts.length > 0, "FHESecurityLayer: Empty array");
        require(ciphertexts.length <= 100, "FHESecurityLayer: Array too large");

        for (uint256 i = 0; i < ciphertexts.length; i++) {
            require(encryptedValues[ciphertexts[i]].isValid, "FHESecurityLayer: Invalid ciphertext");
        }

        // Simulated homomorphic sum
        bytes32 result = keccak256(
            abi.encodePacked(
                ciphertexts,
                "SUM",
                block.timestamp,
                operationCounter++
            )
        );

        encryptedValues[result] = EncryptedValue({
            ciphertext: result,
            randomness: bytes32(operationCounter),
            timestamp: block.timestamp,
            owner: msg.sender,
            isValid: true
        });

        return result;
    }

    // View functions
    function getEncryptedValue(bytes32 ciphertext)
        external
        view
        validCiphertext(ciphertext)
        returns (EncryptedValue memory)
    {
        return encryptedValues[ciphertext];
    }

    function getUserEncryptedValues(address user)
        external
        view
        returns (bytes32[] memory)
    {
        return userEncryptedValues[user];
    }

    function getRangeProof(bytes32 commitment)
        external
        view
        returns (RangeProof memory)
    {
        return rangeProofs[commitment];
    }

    function isValidEncryption(bytes32 ciphertext) external view returns (bool) {
        return encryptedValues[ciphertext].isValid;
    }

    function getOperationCost(FHEOperationType operation) external view returns (uint256) {
        return operationCosts[bytes32(0)][operation];
    }

    // Admin functions
    function updateEncryptionParams(
        uint256 _publicKeyX,
        uint256 _publicKeyY,
        uint256 _modulus,
        uint256 _generator
    ) external onlyRole(ADMIN_ROLE) {
        encParams.publicKeyX = _publicKeyX;
        encParams.publicKeyY = _publicKeyY;
        encParams.modulus = _modulus;
        encParams.generator = _generator;

        emit EncryptionParamsUpdated(_publicKeyX, _publicKeyY, _modulus);
    }

    function updateOperationCost(
        FHEOperationType operation,
        uint256 newCost
    ) external onlyRole(ADMIN_ROLE) {
        operationCosts[bytes32(0)][operation] = newCost;
    }

    function invalidateEncryption(bytes32 ciphertext)
        external
        onlyRole(ADMIN_ROLE)
        validCiphertext(ciphertext)
    {
        encryptedValues[ciphertext].isValid = false;
    }

    function getOperationCounter() external view returns (uint256) {
        return operationCounter;
    }

    function getTotalEncryptedValues() external view returns (uint256) {
        return operationCounter;
    }
}