var numCycles = 0;

updateStatus = function () {
	var status = Status.findOne();
	var statusId = status._id;
	delete status._id;
	if (status) {
		numCycles = numCycles + 1;
		if (numCycles == 10) {
			processVotes();
			numCycles = 0;
			return;
		}
		if (status.voting) {
			if (status.lastVote) {
				var diff = moment().diff(status.lastVote.time);
				status.percent = (diff%5000)/50;
			}
			var votes = Votes.find({number: status.wordNum}).count();
			status.votes = votes;

			Status.update({_id: statusId}, {$set: status});
		}
	}
}

processVotes = function () {
	var status = Status.findOne();
	if (status) {
		if (status.voting) {
			var votes = Votes.find({number: status.wordNum});
			if (votes.count() != 0) {
				Status.update({_id: status._id}, {$set: {voting: false}});
				var totalVotes = votes.count();
				var votesByWord = {};
				var highest = 0;
				var winningWord = '';

				votes.forEach(function (vote) {
					var word = vote.word;
					var numVotes = votesByWord[word];
					if (!numVotes) {
						votesByWord[word] = 1;
						if (!highest) {
							highest = 1;
							winningWord = word;
						}
					}
					else {
						votesByWord[word] = numVotes + 1;
						if (highest< (numVotes + 1)) {
							highest = numVotes + 1;
							winningWord = word;
						}
					}
				});
				
				if (winningWord != '') {
					var votedAt = moment().format();
					var newWord = {
						word: winningWord,
						number: status.wordNum,
						votes: highest,
						time: votedAt
					};
					Words.insert(newWord);

					Status.update({_id: status._id}, {$inc: {wordNum: 1}, $set: {voting: true, votes: 0, percent: 0, lastVote: {time: votedAt, numVotes: totalVotes}}});				
				}

			}
		}
		else {
			console.log('tabulating is taking too long..');

		}
	}
};
