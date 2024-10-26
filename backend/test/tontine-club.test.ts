// test/TontineClub.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { TontineClub } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TontineClub", function () {
  let tontineClub: TontineClub;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const TontineClub = await ethers.getContractFactory("TontineClub");
    tontineClub = await TontineClub.deploy();
    await tontineClub.waitForDeployment();
  });

  describe("Group Creation", function () {
    it("Should create a new group", async function () {
      const tx = await tontineClub.createGroup(
        "Test Group",
        "Test Description",
        ethers.parseEther("0.1"),
        86400 // 1 day in seconds
      );
      await tx.wait();

      const groupCount = await tontineClub.groupCount();
      expect(groupCount).to.equal(1n);

      const groupInfo = await tontineClub.getGroupInfo(1n);
      expect(groupInfo.name).to.equal("Test Group");
      expect(groupInfo.description).to.equal("Test Description");
      expect(groupInfo.contributionAmount).to.equal(ethers.parseEther("0.1"));
    });
  });

  describe("Group Joining", function () {
    beforeEach(async function () {
      await tontineClub.createGroup(
        "Test Group",
        "Test Description",
        ethers.parseEther("0.1"),
        86400
      );
    });

    it("Should allow a member to join", async function () {
      await tontineClub.connect(addr1).joinGroup(1n, "Member 1", {
        value: ethers.parseEther("0.1"),
      });

      const memberInfo = await tontineClub.getMemberInfo(1n, addr1.address);
      expect(memberInfo.exists).to.be.true;
      expect(memberInfo.name).to.equal("Member 1");
    });
  });
});
