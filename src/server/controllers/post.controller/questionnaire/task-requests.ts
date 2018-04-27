export default {
	questions: [
		{
			question: "How would you describe the formatting, language and overall presentation of the post?",
			question_id: 'task-1',
			answers: [
				{
					answer: "The quality of the post is fantastic.",
					answer_id: 'task-1-a-1',
					value: 10,
				},
				{
					answer: "The post is of decent quality, but not spectacular in any way.",
					answer_id: 'task-1-a-2',
					value: 8,
				},
				{
					answer: "The post is poorly written and/or formatted, but readable.",
					answer_id: 'task-1-a-3',
					value: 3,
				},
				{
					answer: "The post is really hard to read and the content is barely understandable.",
					answer_id: 'task-1-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the overall value the contribution solving this task will bring to the open source community?",
			question_id: 'task-2',
			answers: [
				{
					answer: "This task request, if it can be solved, can bring great, unique and impactful value to the community as a whole.",
					answer_id: 'task-2-a-1',
					value: 35,
				},
				{
					answer: "This task request, if it can be solved, adds significant value to the open source community, or is of critical importance to the specific project.",
					answer_id: 'task-2-a-2',
					value: 30,
				},
				{
					answer: "This task request, if it can be solved, adds some value to the open source community or is only valuable to the specific project.",
					answer_id: 'task-2-a-3',
					value: 17.5,
				},
				{
					answer: "This task request cannot be solved and/or adds no value to the open source community or the specific project.",
					answer_id: 'task-2-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How feasible and executable is the task requested?",
			question_id: 'task-3',
			answers: [
				{
					answer: "Very. It is likely to receive multiple potential solutions.",
					answer_id: 'task-3-a-1',
					value: 20,
				},
				{
					answer: "Moderate. It is likely to receive some potential solutions.",
					answer_id: 'task-3-a-2',
					value: 16,
				},
				{
					answer: "Low. The solution will demand a great deal of work, but someone invested in the project could take on this.",
					answer_id: 'task-3-a-3',
					value: 10,
				},
				{
					answer: "Impossible. It is very unlikely anyone will undertake this task.",
					answer_id: 'task-3-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How impactful will this task be for the specific project?",
			question_id: 'task-4',
			answers: [
				{
					answer: "Obviously crucial for ongoing project development.",
					answer_id: 'task-4-a-1',
					value: 10,
				},
				{
					answer: "It will have a major impact on the development and/or end user experience.",
					answer_id: 'task-4-a-2',
					value: 9,
				},
				{
					answer: "It hold some significance to ongoing project development.",
					answer_id: 'task-4-a-3',
					value: 5,
				},
				{
					answer: "The solution to this task will have little to no impact on the project.",
					answer_id: 'task-4-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How descriptive is the task request, and does it provide all necessary information to solve it?",
			question_id: 'task-5',
			answers: [
				{
					answer: "The task request is very descriptive and includes all the required information, as well as additional important data or tips.",
					answer_id: 'task-5-a-1',
					value: 15,
				},
				{
					answer: "The task request is sufficiently descriptive and includes the information required to solve it.",
					answer_id: 'task-5-a-2',
					value: 13.5,
				},
				{
					answer: "The task request includes some information, but it is partially inaccurate, lacking or insufficient to solve the task.",
					answer_id: 'task-5-a-3',
					value: 3,
				},
				{
					answer: "The task request is confusing, lacking information and resources.",
					answer_id: 'task-5-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Is this task request similar to another submitted by the same project owner? ",
			question_id: 'task-6',
			answers: [
				{
					answer: "No, this task request is unique and different from other tasks every posted by this project owner.",
					answer_id: 'task-6-a-1',
					value: 10,
				},
				{
					answer: "Yes, but it was submitted over 30 days ago.",
					answer_id: 'task-6-a-2',
					value: 8,
				},
				{
					answer: "Yes, but it is sufficiently unique and/or necessary for the project development.",
					answer_id: 'task-6-a-3',
					value: 8,
				},
				{
					answer: "Yes, this task request is too similar or a direct copy of another task request submitted by this project owner in the past 30 days.",
					answer_id: 'task-6-a-4',
					value: 0,
				},
			],
		},
	]
};