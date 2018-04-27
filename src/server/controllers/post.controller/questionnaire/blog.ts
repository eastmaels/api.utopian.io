export default {
	questions: [
		{
			question: "How would you describe the formatting, language and overall presentation of the post?",
			question_id: 'blog-1',
			answers: [
				{
					answer: "The quality of the post is fantastic.",
					answer_id: 'blog-1-a-1',
					value: 25,
				},
				{
					answer: "The post is of decent quality, but not spectacular in any way.",
					answer_id: 'blog-1-a-2',
					value: 20,
				},
				{
					answer: "The post is poorly written and/or formatted, but readable.",
					answer_id: 'blog-1-a-3',
					value: 8,
				},
				{
					answer: "The post is really hard to read and the content is barely understandable.",
					answer_id: 'blog-1-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the overall value of this contribution on the open source community?",
			question_id: 'blog-2',
			answers: [
				{
					answer: "This contribution brings great, unique and impactful value to the community as a whole.",
					answer_id: 'blog-2-a-1',
					value: 10,
				},
				{
					answer: "This contribution adds significant value to the open source community, or is of critical importance to the specific project.",
					answer_id: 'blog-2-a-2',
					value: 8.5,
				},
				{
					answer: "This contribution adds some value to the open source community or is only valuable to the specific project.",
					answer_id: 'blog-2-a-3',
					value: 5,
				},
				{
					answer: "This contribution adds no value to the open source community or the specific project.",
					answer_id: 'blog-2-a-4',
					value: 0,
				},
			],
		},
		{
			question: "What is the overall volume of the blog post?",
			question_id: 'blog-3',
			answers: [
				{
					answer: "More than 1,200 words",
					answer_id: 'blog-3-a-1',
					value: 20,
				},
				{
					answer: "800-1,200 words",
					answer_id: 'blog-3-a-2',
					value: 16,
				},
				{
					answer: "500-800 words",
					answer_id: 'blog-3-a-3',
					value: 8,
				},
				{
					answer: "Less than 500 words",
					answer_id: 'blog-3-a-4',
					value: 0,
				},
			],
		},
		{
			question: "What is the topic category of this blog post?",
			question_id: 'blog-4',
			answers: [
				{
					answer: "Project introduction.",
					answer_id: 'blog-4-a-1',
					value: 5,
				},
				{
					answer: "Project promotion.",
					answer_id: 'blog-4-a-2',
					value: 5,
				},
				{
					answer: "Development log / release notes.",
					answer_id: 'blog-4-a-3',
					value: 3.5,
				},
				{
					answer: "Project generic news.",
					answer_id: 'blog-4-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Is the post a part of a series?",
			question_id: 'blog-5',
			answers: [
				{
					answer: "It is clear that it is a part of an ongoing series of posts.",
					answer_id: 'blog-5-a-1',
					value: 10,
				},
				{
					answer: "It is clear that it is the first post of an upcoming series.",
					answer_id: 'blog-5-a-2',
					value: 7.5,
				},
				{
					answer: "It is the first post from the author.",
					answer_id: 'blog-5-a-3',
					value: 4,
				},
				{
					answer: "The post is not a part of any series..",
					answer_id: 'blog-5-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Was relevant quality graphic and video content included in this post?",
			question_id: 'blog-6',
			answers: [
				{
					answer: "Yes, at least 4 distinguishable instances of graphic or video content were included.",
					answer_id: 'blog-6-a-1',
					value: 10,
				},
				{
					answer: "Yes, between 2 and 3 distinguishable instances of graphic or video content were included.",
					answer_id: 'blog-6-a-2',
					value: 7.5,
				},
				{
					answer: "A single instance of graphic or video content was included.",
					answer_id: 'blog-6-a-3',
					value: 3,
				},
				{
					answer: "No graphic or video content was included or the content was irrelevant.",
					answer_id: 'blog-6-a-4',
					value: 0,
				},
			],
		},
		{
			question: "What is the timeframe of the events and announcements discussed in the blog post, and does it include reference to similar projects?",
			question_id: 'blog-7',
			answers: [
				{
					answer: "Both recent and future events, as well as comparison with similar projects is included.",
					answer_id: 'blog-7-a-1',
					value: 10,
				},
				{
					answer: "Events more recent than 2 weeks, or future events related the project are included.",
					answer_id: 'blog-7-a-2',
					value: 9,
				},
				{
					answer: "Comparison with similar projects is included.",
					answer_id: 'blog-7-a-3',
					value: 7,
				},
				{
					answer: "None of these topics are discussed in the post.",
					answer_id: 'blog-7-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How familiar is the author with the project discussed in the post?",
			question_id: 'blog-8',
			answers: [
				{
					answer: "It is clear that they are closely familiar with the project and its details.",
					answer_id: 'blog-8-a-1',
					value: 10,
				},
				{
					answer: "The author offers some valuable insights about the project.",
					answer_id: 'blog-8-a-2',
					value: 7,
				},
				{
					answer: "Most of the blog post contains information gathered from other sources.",
					answer_id: 'blog-8-a-3',
					value: 3,
				},
				{
					answer: "The author knows only little or nothing about the project.",
					answer_id: 'blog-8-a-4',
					value: 0,
				},
			],
		},
	]
};