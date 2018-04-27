export default {
	questions: [
		{
			question: "How would you rate the overall quality of the documentation?",
			question_id: 'doc-1',
			answers: [
				{
					answer: "Fantastic quality! It’s very hard to find documentation this good.",
					answer_id: 'doc-1-a-1',
					value: 32.5,
				},
				{
					answer: "Very high quality.",
					answer_id: 'doc-1-a-2',
					value: 29.25,
				},
				{
					answer: "Average quality - could be improved in many ways.",
					answer_id: 'doc-1-a-3',
					value: 16.25,
				},
				{
					answer: "Very low quality.",
					answer_id: 'doc-1-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How comprehensive was the documentation (how many features were documented, contribution volume, etc.)?",
			question_id: 'doc-2',
			answers: [
				{
					answer: "A significant portion of the project was documented.",
					answer_id: 'doc-2-a-1',
					value: 15,
				},
				{
					answer: "Numerous features or one major feature were documented.",
					answer_id: 'doc-2-a-2',
					value: 13.5,
				},
				{
					answer: "A small feature was documented in detail.",
					answer_id: 'doc-2-a-3',
					value: 6,
				},
				{
					answer: "The documentation was severely lacking.",
					answer_id: 'doc-2-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the overall significance of this particular feature/file documentation to the project?",
			question_id: 'doc-3',
			answers: [
				{
					answer: "Very important, the project is significantly easier to use with it.",
					answer_id: 'doc-3-a-1',
					value: 10,
				},
				{
					answer: "Important, but not critical to use or application of the project. ",
					answer_id: 'doc-3-a-2',
					value: 9,
				},
				{
					answer: "It has some potential uses as reference.",
					answer_id: 'doc-3-a-3',
					value: 4,
				},
				{
					answer: "It’s nearly useless.",
					answer_id: 'doc-3-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Is the documentation developed for the internal staff only, or does it add value to the open source community as a whole?",
			question_id: 'doc-4',
			answers: [
				{
					answer: "It is meant to be used also by open source community members not associated with the project.",
					answer_id: 'doc-4-a-1',
					value: 2.5,
				},
				{
					answer: "It is mainly aimed at open source community members that contribute to this particular project.",
					answer_id: 'doc-4-a-2',
					value: 2.25,
				},
				{
					answer: "It is intended for internal staff use, but the community can also benefit from this content.",
					answer_id: 'doc-4-a-3',
					value: 1,
				},
				{
					answer: "It is clearly meant only for the internal staff of the project and hold no value to the open source community.",
					answer_id: 'doc-4-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Does the author of the documentation understand the project and its needs in detail?",
			question_id: 'doc-5',
			answers: [
				{
					answer: "Yes. The author is clearly very involved in the project.",
					answer_id: 'doc-5-a-1',
					value: 10,
				},
				{
					answer: "The author has good understanding of the project and its needs.",
					answer_id: 'doc-5-a-2',
					value: 8.5,
				},
				{
					answer: "The author clearly understands how the project works.",
					answer_id: 'doc-5-a-3',
					value: 4,
				},
				{
					answer: "The author has no understanding of the project.",
					answer_id: 'doc-5-a-4',
					value: 0,
				},
			],
		},
	]
};