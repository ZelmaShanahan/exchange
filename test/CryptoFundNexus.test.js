const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CryptoFund Nexus", function () {
  // Fixture to deploy contracts
  async function deployCryptoFundNexusFixture() {
    const [owner, creator, investor1, investor2, feeCollector] = await ethers.getSigners();

    // Deploy FHE Security Layer first
    const FHESecurityLayer = await ethers.getContractFactory("FHESecurityLayer");
    const fheSecurityLayer = await FHESecurityLayer.deploy(
      123456789, // publicKeyX (mock value)
      987654321, // publicKeyY (mock value)
      999999999, // modulus (mock value)
      12345      // generator (mock value)
    );

    // Deploy Confidential Exchange
    const ConfidentialExchange = await ethers.getContractFactory("ConfidentialExchange");
    const confidentialExchange = await ConfidentialExchange.deploy(
      await fheSecurityLayer.getAddress(),
      feeCollector.address
    );

    // Deploy main CryptoFund Nexus contract
    const CryptoFundNexus = await ethers.getContractFactory("CryptoFundNexus");
    const cryptoFundNexus = await CryptoFundNexus.deploy(
      await fheSecurityLayer.getAddress(),
      await confidentialExchange.getAddress(),
      feeCollector.address
    );

    // Deploy Mock Token for testing
    const MockToken = await ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy(
      "Test Token",
      "TEST",
      18,
      ethers.parseEther("1000000") // 1M tokens
    );

    // Transfer some tokens to the CryptoFund Nexus contract for distribution
    await mockToken.transfer(
      await cryptoFundNexus.getAddress(),
      ethers.parseEther("500000") // 500K tokens
    );

    return {
      cryptoFundNexus,
      fheSecurityLayer,
      confidentialExchange,
      mockToken,
      owner,
      creator,
      investor1,
      investor2,
      feeCollector
    };
  }

  describe("Deployment", function () {
    it("Should deploy with correct parameters", async function () {
      const { cryptoFundNexus, fheSecurityLayer, confidentialExchange, feeCollector } = 
        await loadFixture(deployCryptoFundNexusFixture);

      expect(await cryptoFundNexus.fheLayer()).to.equal(await fheSecurityLayer.getAddress());
      expect(await cryptoFundNexus.confidentialDEX()).to.equal(await confidentialExchange.getAddress());
      expect(await cryptoFundNexus.feeCollector()).to.equal(feeCollector.address);
    });

    it("Should set correct initial values", async function () {
      const { cryptoFundNexus } = await loadFixture(deployCryptoFundNexusFixture);

      expect(await cryptoFundNexus.getTotalProjects()).to.equal(0);
      expect(await cryptoFundNexus.platformFeeRate()).to.equal(250); // 2.5%
    });

    it("Should grant roles correctly", async function () {
      const { cryptoFundNexus, owner } = await loadFixture(deployCryptoFundNexusFixture);

      const DEFAULT_ADMIN_ROLE = await cryptoFundNexus.DEFAULT_ADMIN_ROLE();
      const ADMIN_ROLE = await cryptoFundNexus.ADMIN_ROLE();
      const VERIFIER_ROLE = await cryptoFundNexus.VERIFIER_ROLE();

      expect(await cryptoFundNexus.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await cryptoFundNexus.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
      expect(await cryptoFundNexus.hasRole(VERIFIER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Project Creation", function () {
    it("Should create a project successfully", async function () {
      const { cryptoFundNexus, mockToken, creator } = await loadFixture(deployCryptoFundNexusFixture);

      const currentTime = Math.floor(Date.now() / 1000);
      
      const metadata = {
        name: "Test Project",
        description: "A test fundraising project",
        website: "https://testproject.com",
        whitepaper: "https://testproject.com/whitepaper.pdf",
        logoHash: "QmTestLogoHash123",
        tokenAddress: await mockToken.getAddress(),
        creator: ethers.ZeroAddress, // Will be set by contract
        tier: 0, // BRONZE
        reputationScore: 0, // Will be set by contract
        isVerified: false,
        isAudited: false
      };

      const config = {
        softCap: ethers.parseEther("10"), // 10 ETH
        hardCap: ethers.parseEther("100"), // 100 ETH
        minInvestment: ethers.parseEther("0.1"), // 0.1 ETH
        maxInvestment: ethers.parseEther("10"), // 10 ETH
        startTime: currentTime + 3600, // 1 hour from now
        endTime: currentTime + (7 * 24 * 3600), // 1 week from now
        tokenPrice: ethers.parseEther("0.001"), // 0.001 ETH per token
        vestingDuration: 30 * 24 * 3600, // 30 days
        hasWhitelist: false
      };

      await expect(cryptoFundNexus.connect(creator).createProject(metadata, config))
        .to.emit(cryptoFundNexus, "ProjectCreated")
        .withArgs(1, creator.address, "Test Project", config.softCap, config.hardCap, 0);

      const project = await cryptoFundNexus.getProject(1);
      expect(project.metadata.name).to.equal("Test Project");
      expect(project.metadata.creator).to.equal(creator.address);
      expect(project.config.softCap).to.equal(config.softCap);
      expect(project.status).to.equal(0); // DRAFT
    });

    it("Should fail with invalid parameters", async function () {
      const { cryptoFundNexus, creator } = await loadFixture(deployCryptoFundNexusFixture);

      const metadata = {
        name: "",
        description: "A test project",
        website: "https://test.com",
        whitepaper: "https://test.com/wp.pdf",
        logoHash: "QmTest",
        tokenAddress: ethers.ZeroAddress,
        creator: ethers.ZeroAddress,
        tier: 0,
        reputationScore: 0,
        isVerified: false,
        isAudited: false
      };

      const config = {
        softCap: 0,
        hardCap: ethers.parseEther("100"),
        minInvestment: ethers.parseEther("0.1"),
        maxInvestment: ethers.parseEther("10"),
        startTime: Math.floor(Date.now() / 1000) + 3600,
        endTime: Math.floor(Date.now() / 1000) + (7 * 24 * 3600),
        tokenPrice: ethers.parseEther("0.001"),
        vestingDuration: 0,
        hasWhitelist: false
      };

      await expect(cryptoFundNexus.connect(creator).createProject(metadata, config))
        .to.be.revertedWith("CryptoFundNexus: Name required");
    });

    it("Should increment project counter", async function () {
      const { cryptoFundNexus, mockToken, creator } = await loadFixture(deployCryptoFundNexusFixture);

      expect(await cryptoFundNexus.getTotalProjects()).to.equal(0);

      const currentTime = Math.floor(Date.now() / 1000);
      
      const metadata = {
        name: "Test Project",
        description: "A test project",
        website: "https://test.com",
        whitepaper: "https://test.com/wp.pdf",
        logoHash: "QmTest",
        tokenAddress: await mockToken.getAddress(),
        creator: ethers.ZeroAddress,
        tier: 0,
        reputationScore: 0,
        isVerified: false,
        isAudited: false
      };

      const config = {
        softCap: ethers.parseEther("10"),
        hardCap: ethers.parseEther("100"),
        minInvestment: ethers.parseEther("0.1"),
        maxInvestment: ethers.parseEther("10"),
        startTime: currentTime + 3600,
        endTime: currentTime + (7 * 24 * 3600),
        tokenPrice: ethers.parseEther("0.001"),
        vestingDuration: 0,
        hasWhitelist: false
      };

      await cryptoFundNexus.connect(creator).createProject(metadata, config);
      expect(await cryptoFundNexus.getTotalProjects()).to.equal(1);
    });

    it("Should grant PROJECT_CREATOR_ROLE to new creators", async function () {
      const { cryptoFundNexus, mockToken, creator } = await loadFixture(deployCryptoFundNexusFixture);

      const PROJECT_CREATOR_ROLE = await cryptoFundNexus.PROJECT_CREATOR_ROLE();
      expect(await cryptoFundNexus.hasRole(PROJECT_CREATOR_ROLE, creator.address)).to.be.false;

      const currentTime = Math.floor(Date.now() / 1000);
      
      const metadata = {
        name: "Test Project",
        description: "A test project",
        website: "https://test.com",
        whitepaper: "https://test.com/wp.pdf",
        logoHash: "QmTest",
        tokenAddress: await mockToken.getAddress(),
        creator: ethers.ZeroAddress,
        tier: 0,
        reputationScore: 0,
        isVerified: false,
        isAudited: false
      };

      const config = {
        softCap: ethers.parseEther("10"),
        hardCap: ethers.parseEther("100"),
        minInvestment: ethers.parseEther("0.1"),
        maxInvestment: ethers.parseEther("10"),
        startTime: currentTime + 3600,
        endTime: currentTime + (7 * 24 * 3600),
        tokenPrice: ethers.parseEther("0.001"),
        vestingDuration: 0,
        hasWhitelist: false
      };

      await cryptoFundNexus.connect(creator).createProject(metadata, config);
      expect(await cryptoFundNexus.hasRole(PROJECT_CREATOR_ROLE, creator.address)).to.be.true;
    });
  });

  describe("Project Launch", function () {
    async function createProjectFixture() {
      const fixture = await deployCryptoFundNexusFixture();
      const { cryptoFundNexus, mockToken, creator } = fixture;

      const currentTime = Math.floor(Date.now() / 1000);
      
      const metadata = {
        name: "Test Project",
        description: "A test project",
        website: "https://test.com",
        whitepaper: "https://test.com/wp.pdf",
        logoHash: "QmTest",
        tokenAddress: await mockToken.getAddress(),
        creator: ethers.ZeroAddress,
        tier: 0,
        reputationScore: 0,
        isVerified: false,
        isAudited: false
      };

      const config = {
        softCap: ethers.parseEther("10"),
        hardCap: ethers.parseEther("100"),
        minInvestment: ethers.parseEther("0.1"),
        maxInvestment: ethers.parseEther("10"),
        startTime: currentTime + 3600,
        endTime: currentTime + (7 * 24 * 3600),
        tokenPrice: ethers.parseEther("0.001"),
        vestingDuration: 0,
        hasWhitelist: false
      };

      await cryptoFundNexus.connect(creator).createProject(metadata, config);

      return { ...fixture, projectId: 1 };
    }

    it("Should launch project successfully", async function () {
      const { cryptoFundNexus, creator, projectId } = await loadFixture(createProjectFixture);

      await expect(cryptoFundNexus.connect(creator).launchProject(projectId))
        .to.emit(cryptoFundNexus, "ProjectStatusChanged")
        .withArgs(projectId, 0, 1); // DRAFT to ACTIVE

      const project = await cryptoFundNexus.getProject(projectId);
      expect(project.status).to.equal(1); // ACTIVE
    });

    it("Should fail if not project creator", async function () {
      const { cryptoFundNexus, investor1, projectId } = await loadFixture(createProjectFixture);

      await expect(cryptoFundNexus.connect(investor1).launchProject(projectId))
        .to.be.revertedWith("CryptoFundNexus: Not project creator");
    });

    it("Should fail if project already launched", async function () {
      const { cryptoFundNexus, creator, projectId } = await loadFixture(createProjectFixture);

      await cryptoFundNexus.connect(creator).launchProject(projectId);
      
      await expect(cryptoFundNexus.connect(creator).launchProject(projectId))
        .to.be.revertedWith("CryptoFundNexus: Project already launched");
    });
  });

  describe("Admin Functions", function () {
    it("Should set platform fee rate", async function () {
      const { cryptoFundNexus, owner } = await loadFixture(deployCryptoFundNexusFixture);

      await cryptoFundNexus.connect(owner).setPlatformFeeRate(500); // 5%
      expect(await cryptoFundNexus.platformFeeRate()).to.equal(500);
    });

    it("Should fail to set fee rate above maximum", async function () {
      const { cryptoFundNexus, owner } = await loadFixture(deployCryptoFundNexusFixture);

      await expect(cryptoFundNexus.connect(owner).setPlatformFeeRate(1500))
        .to.be.revertedWith("CryptoFundNexus: Fee too high");
    });

    it("Should update fee collector", async function () {
      const { cryptoFundNexus, owner, investor1 } = await loadFixture(deployCryptoFundNexusFixture);

      await cryptoFundNexus.connect(owner).setFeeCollector(investor1.address);
      expect(await cryptoFundNexus.feeCollector()).to.equal(investor1.address);
    });

    it("Should pause and unpause contract", async function () {
      const { cryptoFundNexus, owner } = await loadFixture(deployCryptoFundNexusFixture);

      await cryptoFundNexus.connect(owner).pause();
      expect(await cryptoFundNexus.paused()).to.be.true;

      await cryptoFundNexus.connect(owner).unpause();
      expect(await cryptoFundNexus.paused()).to.be.false;
    });
  });

  describe("View Functions", function () {
    it("Should return correct active projects", async function () {
      const { cryptoFundNexus } = await loadFixture(deployCryptoFundNexusFixture);

      const activeProjects = await cryptoFundNexus.getActiveProjects();
      expect(activeProjects.length).to.equal(0);
    });

    it("Should return user projects", async function () {
      const { cryptoFundNexus, creator } = await loadFixture(deployCryptoFundNexusFixture);

      const userProjects = await cryptoFundNexus.getUserProjects(creator.address);
      expect(userProjects.length).to.equal(0);
    });
  });

  describe("Security", function () {
    it("Should prevent direct ETH transfers", async function () {
      const { cryptoFundNexus, investor1 } = await loadFixture(deployCryptoFundNexusFixture);

      await expect(
        investor1.sendTransaction({
          to: await cryptoFundNexus.getAddress(),
          value: ethers.parseEther("1")
        })
      ).to.be.revertedWith("CryptoFundNexus: Direct payments not accepted");
    });

    it("Should enforce access control", async function () {
      const { cryptoFundNexus, investor1 } = await loadFixture(deployCryptoFundNexusFixture);

      await expect(cryptoFundNexus.connect(investor1).setPlatformFeeRate(300))
        .to.be.reverted; // Should be reverted due to access control
    });
  });
});