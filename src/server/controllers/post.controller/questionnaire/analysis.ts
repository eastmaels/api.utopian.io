export default {
	questions: [
		{
			question: "Were all relevant aspects or metrics related to the objective analyzed?",
			question_id: 'analysis-1',
			answers: [
				{
					answer: "All relevant metrics were covered.",
					answer_id: 'analysis-1-a-1',
					value: 25,
				},
				{
					answer: "Only selected metrics were chosen; including more may have provided additional insights.",
					answer_id: 'analysis-1-a-2',
					value: 20,
				},
				{
					answer: "Only a single or narrow aspect was chosen.",
					answer_id: 'analysis-1-a-3',
					value: 10,
				},
				{
					answer: "No metric was chosen.",
					answer_id: 'analysis-1-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the complexity data extraction for this analysis?",
			question_id: 'analysis-2',
			answers: [
				{
					answer: "Gathering the data required complex queries and post-processing.",
					answer_id: 'analysis-2-a-1',
					value: 15,
				},
				{
					answer: "The method of extracting data was moderately challenging.",
					answer_id: 'analysis-2-a-2',
					value: 12,
				},
				{
					answer: "The data can be directly imported for visualization - no additional data transformation was needed.",
					answer_id: 'analysis-2-a-3',
					value: 6,
				},
				{
					answer: "No data was extracted.",
					answer_id: 'analysis-2-a-4',
					value: 0,
				},
			],
		},
		{
			question: "How would you rate the quality of the visualization of the findings?",
			question_id: 'analysis-3',
			answers: [
				{
					answer: "Visualizations presented were superb and beyond expectation.",
					answer_id: 'analysis-3-a-1',
					value: 20,
				},
				{
					answer: "Appropriate and sufficient visualization were used to present the results.",
					answer_id: 'analysis-3-a-2',
					value: 16,
				},
				{
					answer: "Visualizations were included, but lacked in quality and/or quantity.",
					answer_id: 'analysis-3-a-3',
					value: 8,
				},
				{
					answer: "Visualizations included were irrelevant to the objective.",
					answer_id: 'analysis-3-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Was the analysis reproducible through the use of the contribution content?",
			question_id: 'analysis-4',
			answers: [
				{
					answer: "All queries or data gathering methods and all data processing scripts were included.",
					answer_id: 'analysis-4-a-1',
					value: 5,
				},
				{
					answer: "The core query or data gathering method was included and the data processing steps were described.",
					answer_id: 'analysis-4-a-2',
					value: 4,
				},
				{
					answer: "Data gathering methods and processing steps were sketched.",
					answer_id: 'analysis-4-a-3',
					value: 2,
				},
				{
					answer: "Data gathering methods were not included.",
					answer_id: 'analysis-4-a-4',
					value: 0,
				},
			],
		},
		{
			question: "Was it a new and unique analysis?",
			question_id: 'analysis-5',
			answers: [
				{
					answer: "Yes, it was a unique analysis.",
					answer_id: 'analysis-5-a-1',
					value: 5,
				},
				{
					answer: "It’s similar to another contribution, but covers deeper or additional aspects.",
					answer_id: 'analysis-5-a-2',
					value: 4,
				},
				{
					answer: "It’s similar to another contribution, but covers a different time period.",
					answer_id: 'analysis-5-a-3',
					value: 4,
				},
				{
					answer: "It’s a recurring analysis covering too short a time frame (i.e., daily).",
					answer_id: 'analysis-5-a-4',
					value: 0,
				},
			],
		},
	]
};