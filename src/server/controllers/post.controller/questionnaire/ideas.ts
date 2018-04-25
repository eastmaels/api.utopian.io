export default {
	questions: [
		{
			question: "Is the suggested feature commonly seen in other similar projects?",
			question_id: 'ideas-1',
			answers: [
				{
					answer: "No, it’s unique or very rare.",
					answer_id: 'ideas-1-a-1',
					value: 10,
				},
				{
					answer: "Yes, but it’s a feature of high importance for this kind of project.",
					answer_id: 'ideas-1-a-2',
					value: 9,
				},
				{
					answer: "It's common, but it will have some measurable positive impact on the user experience.",
					answer_id: 'ideas-1-a-3',
					value: 3,
				},
				{
					answer: "It’s extremely common and not majorly impactful.",
					answer_id: 'ideas-1-a-4',
					value: 0,
				}],
		},
		{
			question: "Does this suggestion match the goals and/or roadmap of the project?",
			question_id: 'ideas-2',
			answers: [
				{
					answer: "Yes, it’s closely related to the main goals of the project.",
					answer_id: 'ideas-2-a-1',
					value: 15,
				},
				{
					answer: "It is related, but does not match the main goal and purpose of the project.",
					answer_id: 'ideas-2-a-2',
					value: 10.5,
				},
				{
					answer: "It is loosely related to one of the goals of the project.",
					answer_id: 'ideas-2-a-3',
					value: 6,
				},
				{
					answer: "It is not related to the project goals at all.",
					answer_id: 'ideas-2-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Is the proposal realistic?",
			question_id: 'ideas-3',
			answers: [
				{
					answer: "Yes, it can definitely be achieved and is important enough to warrant the developers attention and time.",
					answer_id: 'ideas-3-a-1',
					value: 10,
				},
				{
					answer: "Yes, it can definitely be achieved, but is not likely to get noticed by the development team immediately.",
					answer_id: 'ideas-3-a-2',
					value: 8,
				},
				{
					answer: "It can be achieved theoretically, but no open source solutions to this problem have been suggested previously.",
					answer_id: 'ideas-3-a-3',
					value: 4,
				},
				{
					answer: "No, it’s impossible to achieve.",
					answer_id: 'ideas-3-a-4',
					value: 0,
				},
			],
		},
		{
			question: "What is the potential impact of the change proposed on the usability of the project?",
			question_id: 'ideas-4',
			answers: [
				{
					answer: "It will have a major positive impact on the project for both the project owner and end user.",
					answer_id: 'ideas-4-a-1',
					value: 15,
				},
				{
					answer: "It will have a significant impact on the project for end users.",
					answer_id: 'ideas-4-a-2',
					value: 12,
				},
				{
					answer: "It will change how users utilize the project by a minor margin.",
					answer_id: 'ideas-4-a-3',
					value: 6,
				},
				{
					answer: "It will bring little to no change",
					answer_id: 'ideas-4-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Has the contributor proposed a possible solution to implement the suggestion?",
			question_id: 'ideas-5',
			answers: [
				{
					answer: "Yes, the possible solution is described in great detail and makes a lot of sense.",
					answer_id: 'ideas-5-a-1',
					value: 5,
				},
				{
					answer: "Yes, but the possible solution was not described in sufficient detail.",
					answer_id: 'ideas-5-a-2',
					value: 4,
				},
				{
					answer: "No, but the implementation is self explanatory.",
					answer_id: 'ideas-5-a-3',
					value: 4,
				},
				{
					answer: "No, there’s no proposed solution though one is clearly necessary.",
					answer_id: 'ideas-5-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Is the suggestion original in nature, or were similar suggestions submitted to Utopian in the past?",
			question_id: 'ideas-6',
			answers: [
				{
					answer: "The suggestion is original and obviously unique.",
					answer_id: 'ideas-6-a-1',
					value: 10,
				},
				{
					answer: "This kind of suggestion is fairly uncommon on Utopian.",
					answer_id: 'ideas-6-a-2',
					value: 8,
				},
				{
					answer: "This is a common suggestion for other projects.",
					answer_id: 'ideas-6-a-3',
					value: 2,
				},
				{
					answer: "The suggestion is clearly not well thought-out and holds no actual value.",
					answer_id: 'ideas-6-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Has the user provided any mockups (illustrations) of potential suggestion implementation appearance?",
			question_id: 'ideas-7',
			answers: [
				{
					answer: "Yes, and they’re of excellent quality.",
					answer_id: 'ideas-7-a-1',
					value: 5,
				},
				{
					answer: "No, but the mockups are inapplicable for this suggestion.",
					answer_id: 'ideas-7-a-2',
					value: 5,
				},
				{
					answer: "Yes, but the quality of the mockups is poor.",
					answer_id: 'ideas-7-a-3',
					value: 2,
				},
				{
					answer: "No, there are no mockups included even though they are needed.",
					answer_id: 'ideas-7-a-4',
					value: 0,
				},
			],
		},
	]
};