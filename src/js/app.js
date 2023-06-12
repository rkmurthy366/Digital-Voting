App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Contest.json", function (data) {
      let contest = data;
      App.contracts.Contest = TruffleContract(contest);
      App.contracts.Contest.setProvider(web3.currentProvider);
      return App.render();
    });
  },

  render: function () {
    let contestInstance;
    let loader = $("#loader");
    let content = $("#content");
    loader.show();
    content.hide();
    $("#after").hide();
    $("#adminControl").hide();

    const ADMIN = "0x9b7c34650c1a8d805bde32fc0496b3f39253fbce";
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html(`Your account: ${account}`);
        if (App.account != ADMIN) {
          $("#adminControl").show();
          $("#addCandiBtn").prop("disabled", true);
          $("#voterRegBtn").prop("disabled", true);
          $("#changePhaseBtn").prop("disabled", true);
        }
      }
    });

    // ------------- fetching candidates to front end from blockchain code-------------
    let contestantsPromises = [];
    App.contracts.Contest.deployed()
      .then(function (instance) {
        contestInstance = instance;
        return contestInstance.contestantsCount();
      })
      .then(function (contestantsCount) {
        let contestantsResults = $("#votingCenter");
        contestantsResults.empty();
        let contestantsResultsAdmin = $("#contestantsResultsAdmin");
        contestantsResultsAdmin.empty();
        
        for (let i = 1; i <= contestantsCount; i++) {
          let promise = contestInstance.contestants(i).then(function (contestant) {
            let id = contestant[0];
            let name = contestant[1];
            let voteCount = contestant[2];
            let fetchedParty = contestant[3];
            let fetchedAge = contestant[4];
            let fetchedQualification = contestant[5];
            
            let contestantTemplate =`
              <tr>
                <th>${id}</th>
                <td>${fetchedParty}</td>
                <td>${name}</td>
                <td>${fetchedAge}</td>
                <td><button id="voteBtn-${id}" style="margin:0; padding:9px 40px" class="btn btn-success" onClick="App.castVote(${id.toString()})">VOTE</button></td>
              </tr> 
            `;
            contestantsResults.append(contestantTemplate);

            let contestantTemplateAdmin = `
              <tr>
                <th>${id}</th>
                <td>${name}</td>
                <td>${fetchedAge}</td>
                <td>${fetchedParty}</td>
                <td>${fetchedQualification}</td>
              </tr> 
            `;
            contestantsResultsAdmin.append(contestantTemplateAdmin);
          });
          contestantsPromises.push(promise);
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });

    // ------------- fetching if user voted or not, if voted to whom? -------------
    App.contracts.Contest.deployed()
      .then(function (instance) {
        contestInstance = instance;
        return contestInstance.voters(App.account);
      })
      .then(function (voter) {
        let contestentId = voter[2];
        console.log(contestentId)
        if(!contestentId){
          // user dint vote
          let text = `User dint vote yet`;
          $("#userVoted").html(text);
        } else {
          // user voted to getContestentVoted
          contestInstance.contestants(contestentId).then(function (contestant) {
            let name = contestant[1];
            let fetchedParty = contestant[3];
            let text = `User already voted to ${name}, ${fetchedParty}`;
            $("#userVoted").html(text);
          })
        }  

      })
      .catch(function (err) {
        console.error(err);
      });

    // ------------- fetching current phase code -------------
    App.contracts.Contest.deployed()
      .then(function (instance) {
        return instance.state();
      })
      .then(function (state) {
        let fetchedState;
        let fetchedStateAdmin;
        if (state == 0) {
          fetchedState = "Registration phase is LIVE, Please register yourself to vote !!";
          fetchedStateAdmin = "Registration";
          $("#regDone").hide();
          Promise.all(contestantsPromises).then(function () {
            $("[id^='voteBtn-']").prop("disabled", true);
          });
        } else if (state == 1) {
          fetchedState = "Voting is now live !!!";
          fetchedStateAdmin = "Voting";
          $(document).ready(function() {
            let buttons = $("[id^='voteBtn-']");
            buttons.text("New Text");
          });
          $("#addCandiBtn").prop("disabled", true);
          $("#voterPreRegBtn").prop("disabled", true);
          $("#voterRegBtn").prop("disabled", true);
        } else {
          fetchedState = "Voting is now over !!!";
          fetchedStateAdmin = "Election over";
          Promise.all(contestantsPromises).then(function () {
            $("[id^='voteBtn-']").prop("disabled", true);
          });
          $("#changePhaseBtn").prop("disabled", true);
          $("#addCandiBtn").prop("disabled", true);
          $("#voterPreRegBtn").prop("disabled", true);
          $("#voterRegBtn").prop("disabled", true);
        }

        let currentPhase = $("#currentPhase"); //for user
        currentPhase.empty();
        let currentPhaseAdmin = $("#currentPhaseAdmin"); //for admin
        currentPhaseAdmin.empty();
        let phaseTemplate = `<h3>${fetchedState}</h3>`;
        let phaseTemplateAdmin = `<h2> Current Phase : ${fetchedStateAdmin}</h2>`;
        currentPhase.append(phaseTemplate);
        currentPhaseAdmin.append(phaseTemplateAdmin);
      })
      .catch(function (err) {
        console.error(err);
      });

    // ------------- showing result -------------
    App.contracts.Contest.deployed()
      .then(function (instance) {
        return instance.state();
      })
      .then(function (state) {
        let result = $("#Results");
        if (state == 2) {
          $("#not").hide();
          contestInstance.contestantsCount().then(function (contestantsCount) {
            for (let i = 1; i <= contestantsCount; i++) {
              contestInstance.contestants(i).then(function (contestant) {
                let id = contestant[0];
                let name = contestant[1];
                let voteCount = contestant[2];
                let fetchedParty = contestant[3];
                let fetchedAge = contestant[4];
                let fetchedQualification = contestant[5];

                let resultTemplate = `
                  <tr>
                    <th>${id}</th>
                    <td>${name}</td>
                    <td>${fetchedAge}</td>
                    <td>${fetchedParty}</td>
                    <td>${voteCount}</td>
                  </tr> 
                `;
                result.append(resultTemplate);
              });
            }
          });
        } else {
          $("#renderTable").hide();
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  // ------------- voting code -------------
  castVote: function (id) {
    let contestantId = id;
    App.contracts.Contest.deployed()
      .then(function (instance) {
        return instance.vote(contestantId, { from: App.account });
      })
      .then(function (result) {
        $("#loader").show();
        location.reload();
      })
      .catch(function (err) {
        console.error(err);
      });
  },

  // ------------- adding candidate code -------------
  addCandidate: function () {
    $("#loader").hide();
    $("#addCandiBtn").prop("disabled", true);

    let name = $("#name").val();
    let age = $("#age").val();
    let party = $("#party").val();
    let qualification = $("#qualification").val();
    console.log("name=", name);
    console.log("age=", age);
    console.log("party=", party);
    console.log("qualification=", qualification);

    App.contracts.Contest.deployed()
      .then(function (instance) {
        return instance.addContestant(name, party, age, qualification, {
          from: App.account,
        });
      })
      .then(function (result) {
        $("#loader").show();
        $("#name").val("");
        $("#age").val("");
        $("#party").val("");
        $("#qualification").val("");
        $("#addCandiBtn").prop("disabled", false);
      })
      .catch(function (err) {
        $("#addCandiBtn").prop("disabled", false);
        console.error(err);
      });
  },

  // ------------- changing phase code -------------
  changeState: function () {
    $("#changePhaseBtn").prop("disabled", true);
    App.contracts.Contest.deployed()
      .then(function (instance) {
        return instance.changeState({ from: App.account });
      })
      .then(function (result) {
        $("#content").hide();
        $("#loader").show();
        $("#changePhaseBtn").prop("disabled", false);
        location.reload();
      })
      .catch(function (err) {
        if ((err.code = 336)) {
          $("#changePhaseBtn").prop("disabled", false);
        }
        console.error(err);
      });
  },

  // ------------- registering voter code -------------
  registerVoter: function () {
    let add = $("#accadd").val();
    $("#voterRegBtn").prop("disabled", true);
    App.contracts.Contest.deployed()
      .then(function (instance) {
        return instance.voterRegisteration(add, { from: App.account });
      })
      .then(function (result) {
        $("#content").hide();
        $("#loader").show();
        $("#voterRegBtn").prop("disabled", false);
      })
      .catch(function (err) {
        if (err = 4001)
          $("#voterRegBtn").prop("disabled", false);
        console.error(err);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
