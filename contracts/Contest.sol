// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Contest{	
	struct Contestant{
		uint id;
		string name;
		uint voteCount;
		string party;
		uint age;
		string qualification;
	}

	struct Voter{
		bool isRegistered;
		bool hasVoted;
		uint vote;
	}

	address admin;
	mapping(uint => Contestant) public contestants; 
    mapping(address => Voter) public voters;
	uint public contestantsCount;
	
	enum PHASE{reg, voting , done}
	PHASE public state;
	uint stateNum;

	modifier onlyAdmin(){
		require(msg.sender==admin);
		_;
	}
	
	modifier validState(PHASE x){
	    require(state==x);
	    _;
	}

	constructor() {
		admin=msg.sender;
        state=PHASE.reg;
		stateNum=0;
	}

    function changeState() onlyAdmin public{
		stateNum++;
        state = PHASE(stateNum);
    }
 
	function addContestant(string memory _name , string memory _party , uint _age , string memory _qualification) public onlyAdmin validState(PHASE.reg){
		contestantsCount++;
		contestants[contestantsCount]=Contestant(contestantsCount,_name,0,_party,_age,_qualification);
	}

	function voterRegisteration(address user) public onlyAdmin validState(PHASE.reg){
		voters[user].isRegistered=true;
	}

	function vote(uint _contestantId) public validState(PHASE.voting){
		require(voters[msg.sender].isRegistered);
		require(!voters[msg.sender].hasVoted);
        require(_contestantId > 0 && _contestantId<=contestantsCount);
		contestants[_contestantId].voteCount++;
		voters[msg.sender].hasVoted=true;
		voters[msg.sender].vote=_contestantId;
	}

	function winnerContestent() public view validState(PHASE.done) returns (Contestant memory) {
		Contestant memory winner;
		uint maxVotes = 0;
		for (uint i = 1; i <= contestantsCount; i++) {
			if (contestants[i].voteCount > maxVotes) {
				maxVotes = contestants[i].voteCount;
				winner = contestants[i];
			}
		}
		return winner;
	}

	// function getVotedContestent() public view returns (Contestant memory) {
	// 	require(voters[msg.sender].isRegistered, "voter not registered");
    //     require(voters[msg.sender].hasVoted, "voter not voted");
    //     require(state == PHASE.voting || state == PHASE.done, "Invalid state");
	// 	uint contestantId = voters[msg.sender].vote;
	// 	return contestants[contestantId];
    // }
}