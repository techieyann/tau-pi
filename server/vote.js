

updateStatus = function () {
	if (!updating) {
		updating = true;
		var status = Status.findOne();
		if (status) {
			var pv = pvStatus.findOne({statusId: status._id});
			if (!pv) {
				pv = {
					statusId: status._id,
					percent: 0,
					votes: 0
				};
				pvStatus.insert(pv);
			}
			else delete pv._id;
			numCycles = numCycles + 1;
			if (status.voting) {
				pv.percent = numCycles*10;
				var votes = Votes.find({number: status.wordNum}).count();
				pv.votes = votes;
				pvStatus.update({statusId: status._id}, {$set: pv});
			}

			if (numCycles >= 10) {
				numCycles = -1;
				processVotes();
			}
		}
		updating = false;
	}
}

processVotes = function () {
	var status = Status.findOne();
	if (status) {
		var pv = pvStatus.findOne({statusId: status._id}); 
		if (pv) {
			var votes = Votes.find({number: status.wordNum});
			if (pv.votes != 0) {
				Status.update({_id: status._id}, {$set: {voting: false}});
				var totalVotes = pv.votes;
				var votesByWord = {};
				var membersByWord = {};
				var highest = 0;
				var winningWord = '';

				votes.forEach(function (vote) {
					var word = vote.word;

					var members = membersByWord[word];
					if (members) members.push(vote.member);
					else membersByWord[word] = [vote.member];

					var numVotes = votesByWord[word];
					if (!numVotes) {
						votesByWord[word] = 1;
						if (!highest) {
							highest = 1;
						}
					}
					else {
						votesByWord[word] = numVotes + 1;
						if (highest< (numVotes + 1)) {
							highest = numVotes + 1;
						}
					}
				});

				var tieBreaker = [];
				for(var word in membersByWord) {
					if (membersByWord[word].length == highest) tieBreaker.push(word);
				}

				winningWord = tieBreaker[Math.floor(Math.random() * tieBreaker.length)];

				if (winningWord != '') {
					var votedAt = moment().format();
					var newWord = {
						word: winningWord,
						number: status.wordNum,
						votes: highest,
						totalVotes: status.votes,
						time: votedAt,
						votedBy: membersByWord[winningWord]
					};
					Words.insert(newWord);
					Status.update({_id: status._id}, {$inc: {wordNum: 1}, $set: {voting: true, lastVote: votedAt}});
					Meteor.users.update({_id: {$in: membersByWord[word]}}, {$inc: {'profile.winningWords': 1}});
				}
			}		
		}
		else {
			console.log('tabulating is taking too long..');

		}
	}
};
