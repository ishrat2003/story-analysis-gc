var conditions = ["lc_text_1", "lc_viz_1", "lc_text_2", "lc_viz_2"]

function balancedLatinSquare(conditions, participantId) {
	result = [];
	// Based on "Bradley, J. V. Complete counterbalancing of immediate sequential effects in a Latin square design. J. Amer. Statist. Ass.,.1958, 53, 525-528. "
	for (var i = 0, j = 0, h = 0; i < conditions.length; ++i) {
		var val = 0;
		if (i < 2 || i % 2 != 0) {
			val = j++;
		} else {
			val = conditions.length - h - 1;
			++h;
		}

		var idx = (val + participantId) % conditions.length;
		result.push(conditions[idx]);
	}

	if (array.length % 2 != 0 && participantId % 2 != 0) {
		result = result.reverse();
	}

	return result;
}