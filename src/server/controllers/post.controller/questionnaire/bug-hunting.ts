export default {
	questions: [
		{
			question: "What was the severity level of the bug?",
			question_id: 'bug-1',
			answers: [
				{
					answer: "Critical",
					answer_id: 'bug-1-a-1',
					value: 45,
				},
				{
					answer: "Major",
					answer_id: 'bug-1-a-2',
					value: 38.5,
				},
				{
					answer: "Minor",
					answer_id: 'bug-1-a-3',
					value: 29,
				},
				{
					answer: "Trivial",
					answer_id: 'bug-1-a-4',
					value: 0,
				}
			],
		},
		{
			question: "Were the steps to reproduce the bug easy to understand and follow?",
			question_id: 'bug-2',
			answers: [
				{
					answer: "Yes, the steps were clearly understandable and easy to follow.",
					answer_id: 'bug-2-a-1',
					value: 7.5,
				},
				{
					answer: "The steps were easy to follow, but were not described with sufficient clarity.",
					answer_id: 'bug-2-a-2',
					value: 5.25,
				},
				{
					answer: "The description of the steps severely lacked in clarity, but it is possible to reproduce.",
					answer_id: 'bug-2-a-3',
					value: 2.25,
				},
				{
					answer: "The steps are badly explained and nearly impossible to follow.",
					answer_id: 'bug-2-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Was the bug a technical issue or a user experience (UX) issue?",
			question_id: 'bug-3',
			answers: [
				{
					answer: "It was largely technical but also had significant impact on the user experience.",
					answer_id: 'bug-3-a-1',
					value: 10,
				},
				{
					answer: "It was purely technical.",
					answer_id: 'bug-3-a-2',
					value: 9,
				},
				{
					answer: "It described a UX issue caused by a technical error.",
					answer_id: 'bug-3-a-3',
					value: 5,
				},
				{
					answer: "It described a UX issue alone.",
					answer_id: 'bug-3-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How common and easy to discover was the bug reported?",
			question_id: 'bug-4',
			answers: [
				{
					answer: "The bug was a very common occurrence and impacted the end user experience significantly.",
					answer_id: 'bug-4-a-1',
					value: 7.5,
				},
				{
					answer: "The bug was relatively common, but avoidable.",
					answer_id: 'bug-4-a-2',
					value: 6,
				},
				{
					answer: "The bug was very rare but impactful.",
					answer_id: 'bug-4-a-3',
					value: 3,
				},
				{
					answer: "The bug was nearly impossible to encounter without actively looking for it.",
					answer_id: 'bug-4-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Has the contributor reported the issue to the project owner prior to submitting it to Utopian?",
			question_id: 'bug-5',
			answers: [
				{
					answer: "Yes, it was reported by this contributor and acknowledged by the project owner. Utopian was never mentioned in the process.",
					answer_id: 'bug-5-a-1',
					value: 5,
				},
				{
					answer: "Yes, it was reported by this contributor but has to yet be acknowledged by the project owner.",
					answer_id: 'bug-5-a-2',
					value: 4,
				},
				{
					answer: "No, it was not reported, but an effort to alert the project owner has been made.",
					answer_id: 'bug-5-a-3',
					value: 1.25,
				},
				{
					answer: "No, it was not reported OR there is evidence the user contacted the project owner on behalf of Utopian without permission.",
					answer_id: 'bug-5-a-4',
					value: 0,
				},
			],
		},
	]
};