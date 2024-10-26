// contracts/TontineClub.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TontineClub {
    struct Member {
        address memberAddress;
        string name;
        bool hasReceivedPot;
        bool hasContributedThisRound;
        uint256 totalContributed;
        bool exists;
    }
    
    struct Group {
        string name;
        string description;
        uint256 contributionAmount;
        uint256 roundDuration;
        uint256 currentRound;
        address[] members;
        bool active;
    }
    
    uint256 public groupCount;
    mapping(uint256 => Group) public groups;
    mapping(uint256 => mapping(address => Member)) public groupMembers;
    
    event GroupCreated(uint256 indexed groupId, string name, address creator);
    event MemberJoined(uint256 indexed groupId, address indexed member);
    event ContributionMade(uint256 indexed groupId, address indexed member, uint256 amount);
    
    function createGroup(
        string memory _name,
        string memory _description,
        uint256 _contributionAmount,
        uint256 _roundDuration
    ) external {
        groupCount++;
        Group storage newGroup = groups[groupCount];
        newGroup.name = _name;
        newGroup.description = _description;
        newGroup.contributionAmount = _contributionAmount;
        newGroup.roundDuration = _roundDuration;
        newGroup.active = true;
        
        emit GroupCreated(groupCount, _name, msg.sender);
    }
    
    function joinGroup(uint256 _groupId, string memory _name) external payable {
        require(groups[_groupId].active, "Group is not active");
        require(!groupMembers[_groupId][msg.sender].exists, "Already a member");
        
        if(groups[_groupId].members.length > 0) {
            require(msg.value == groups[_groupId].contributionAmount, "Incorrect contribution");
        }
        
        Member storage newMember = groupMembers[_groupId][msg.sender];
        newMember.memberAddress = msg.sender;
        newMember.name = _name;
        newMember.exists = true;
        newMember.totalContributed = msg.value;
        
        groups[_groupId].members.push(msg.sender);
        
        emit MemberJoined(_groupId, msg.sender);
    }
    
    function contribute(uint256 _groupId) external payable {
        require(groupMembers[_groupId][msg.sender].exists, "Not a member");
        require(msg.value == groups[_groupId].contributionAmount, "Incorrect amount");
        
        Member storage member = groupMembers[_groupId][msg.sender];
        member.totalContributed += msg.value;
        member.hasContributedThisRound = true;
        
        emit ContributionMade(_groupId, msg.sender, msg.value);
    }

    function getGroupInfo(uint256 _groupId) external view returns (
        string memory name,
        string memory description,
        uint256 contributionAmount,
        uint256 roundDuration,
        uint256 currentRound,
        address[] memory members,
        bool active
    ) {
        Group storage group = groups[_groupId];
        return (
            group.name,
            group.description,
            group.contributionAmount,
            group.roundDuration,
            group.currentRound,
            group.members,
            group.active
        );
    }

    function getMemberInfo(uint256 _groupId, address _member) external view returns (
        address memberAddress,
        string memory name,
        bool hasReceivedPot,
        bool hasContributedThisRound,
        uint256 totalContributed,
        bool exists
    ) {
        Member storage member = groupMembers[_groupId][_member];
        return (
            member.memberAddress,
            member.name,
            member.hasReceivedPot,
            member.hasContributedThisRound,
            member.totalContributed,
            member.exists
        );
    }
}