export default {
	questions: [
		{
			question: "How would you describe the formatting, language and overall presentation of the post?",
			question_id: 'dev-1',
			answers: [
				{
					answer: "The post is of very high quality.",
					answer_id: 'dev-1-a-1',
					value: 10,
				},
				{
					answer: "The post is of decent quality, but not spectacular in any way.",
					answer_id: 'dev-1-a-2',
					value: 7,
				},
				{
					answer: "The post is poorly written and/or formatted, but readable.",
					answer_id: 'dev-1-a-3',
					value: 3,
				},
				{
					answer: "The post is really hard to read and the content is barely understandable.",
					answer_id: 'dev-1-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the impact and significance of the contribution to the project and/or open source ecosystem in terms of uniqueness, usefulness and potential future applications?",
			question_id: 'dev-2',
			answers: [
				{
					answer: "This contribution adds high value and holds great significance for the project and/or open source ecosystem.",
					answer_id: 'dev-2-a-1',
					value: 35,
				},
				{
					answer: "This contribution adds significant value to the project and/or open source ecosystem. ",
					answer_id: 'dev-2-a-2',
					value: 23,
				},
				{
					answer: "This contribution adds some value to the project and/or open source ecosystem.",
					answer_id: 'dev-2-a-3',
					value: 12.5,
				},
				{
					answer: "This contribution hold no value and is insignificant in impact. ",
					answer_id: 'dev-2-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the total volume of work invested into this contribution?",
			question_id: 'dev-3',
			answers: [
				{
					answer: "This contribution appears to have demanded a lot of intensive work.",
					answer_id: 'dev-3-a-1',
					value: 20,
				},
				{
					answer: "This contribution appears to have required an average volume of work.",
					answer_id: 'dev-3-a-2',
					value: 14,
				},
				{
					answer: "This contribution shows some work done.",
					answer_id: 'dev-3-a-3',
					value: 6,
				},
				{
					answer: "This contribution shows no work done.",
					answer_id: 'dev-3-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the quality of the code submitted?",
			question_id: 'dev-4',
			answers: [
				{
					answer: "High - it follows all best practices. ",
					answer_id: 'dev-4-a-1',
					value: 20,
				},
				{
					answer: "Average - it follows most best practices.",
					answer_id: 'dev-4-a-2',
					value: 14,
				},
				{
					answer: "Low - it follows some best practices.",
					answer_id: 'dev-4-a-3',
					value: 6,
				},
				{
					answer: "Very low - it doesn't follow any best practices. ",
					answer_id: 'dev-4-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the knowledge and expertise necessary to fix the bug / implement the added feature(s)?",
			question_id: 'dev-5',
			answers: [
				{
					answer: "High - a lot of research and specific knowledge was required.",
					answer_id: 'dev-5-a-1',
					value: 7.5,
				},
				{
					answer: "Average - some research and knowledge was required.",
					answer_id: 'dev-5-a-2',
					value: 5.25,
				},
				{
					answer: "Low - not much knowledge or skill were required.",
					answer_id: 'dev-5-a-3',
					value: 2.25,
				},
				{
					answer: "Insignificant - no knowledge or skills were necessary.",
					answer_id: 'dev-5-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the accuracy and readability of the commit messages?",
			question_id: 'dev-6',
			answers: [
				{
					answer: "High - they are concise, descriptive and consistent. ",
					answer_id: 'dev-6-a-1',
					value: 2.5,
				},
				{
					answer: "Average - they are mostly concise, descriptive and consistent. ",
					answer_id: 'dev-6-a-2',
					value: 2,
				},
				{
					answer: "Low - they could be more concise, descriptive or consistent.",
					answer_id: 'dev-6-a-3',
					value: 0.75,
				},
				{
					answer: "Very low - they aren't concise, descriptive or consistent at all.",
					answer_id: 'dev-6-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How do you rate the quality of the comments in the code?",
			question_id: 'dev-7',
			answers: [
				{
					answer: "High - everything is well-commented and adds to the readability of the code. ",
					answer_id: 'dev-7-a-1',
					value: 5,
				},
				{
					answer: "Average - most of the code is commented and most if it adds to the readability of the code.",
					answer_id: 'dev-7-a-2',
					value: 3,
				},
				{
					answer: "Low - little of the code is commented, but it still adds to the readability.",
					answer_id: 'dev-7-a-3',
					value: 1.5,
				},
				{
					answer: "Very low - the added comments provide no value or are not present at all.",
					answer_id: 'dev-7-a-4',
					value: 0,
				},
			],
		},
	]
};
