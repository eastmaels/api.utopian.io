export default {
    questions: [
        {
            question: "How many distinctive designs were provided? E.g., if the project owner requires 3 designs, then it is counted as a single distinctive design.",
            question_id: 'graphics-1',
            answers: [
                {
                    answer: "More than 3 distinctive, relatively complex designs were provided.",
                    answer_id: 'graphics-1-a-1',
                    value: 20,
                },
                {
                    answer: "Between 1 and 3; the designs were complex and took a fair amount of work.",
                    answer_id: 'graphics-1-a-2',
                    value: 10,
                },
                {
                    answer: "Between 1 and 3, but the designs were really simple and didn’t require much work.",
                    answer_id: 'graphics-1-a-3',
                    value: 5,
                },
                {
                    answer: "Fewer than the project owner requested and/or the work invested was absolutely minimal.",
                    answer_id: 'graphics-1-a-4',
                    value: 0,
                }],
        },
        {
            question: "Is the whole contribution a result of own work?",
            question_id: 'graphics-2',
            answers: [
                {
                    answer: "Yes.",
                    answer_id: 'graphics-2-a-1',
                    value: 5,
                },
                {
                    answer: "Some third party assets were used but all of them are usable for the contribution actual purpose. The assets were accordingly edited and not simply downloaded and used.",
                    answer_id: 'graphics-2-a-2',
                    value: 3,
                },
                {
                    answer: "Other assets were provided by the project owner.",
                    answer_id: 'graphics-2-a-3',
                    value: 2,
                },
                {
                    answer: "Most assets used were third party assets and contributor did not make additional effort to incorporate them in the contribution.",
                    answer_id: 'graphics-2-a-4',
                    value: 0,
                }],
        },
        {
            question: "Did the contributor provide evidence of graphics consultation or other relevant kind of communication with the project owner?",
            question_id: 'graphics-3',
            answers: [
                {
                    answer: "Yes. Communication was perfect.",
                    answer_id: 'graphics-3-a-1',
                    value: 5,
                },
                {
                    answer: "Yes, but communication was not professional or very detailed.",
                    answer_id: 'graphics-3-a-2',
                    value: 3.5,
                },
                {
                    answer: "No, but the contributor tried to reach out to the project owner.",
                    answer_id: 'graphics-3-a-3',
                    value: 1.5,
                },
                {
                    answer: "No, no communication happened OR there is evidence the user contacted the project owner on behalf of Utopian without permission.",
                    answer_id: 'graphics-3-a-4',
                    value: 0,
                }],
        },
        {
            question: "Was the contribution used in the project?",
            question_id: 'graphics-4',
            answers: [
                {
                    answer: "Yes and the contributor provided clear evidence of it, and/or the project owner publicly announced that it will be used.",
                    answer_id: 'graphics-4-a-1',
                    value: 20,
                },
                {
                    answer: "It was not used, but the project owner liked it and considered using it.",
                    answer_id: 'graphics-4-a-2',
                    value: 12,
                },
                {
                    answer: "It was not used, but is of very high quality.",
                    answer_id: 'graphics-4-a-3',
                    value: 7,
                },
                {
                    answer: "It was not used as it provides no value to the project.",
                    answer_id: 'graphics-4-a-4',
                    value: 0,
                }],
        },
        {
            question: "Does the contribution include files for immediate use in all requested formats?",
            question_id: 'graphics-5',
            answers: [
                {
                    answer: "Yes, all required file formats were included.",
                    answer_id: 'graphics-5-a-1',
                    value: 10,
                },
                {
                    answer: "Most requested file formats requested by project owner were provided, but not all.",
                    answer_id: 'graphics-5-a-2',
                    value: 5,
                },
                {
                    answer: "No, submitted files were not ready for immediate use and require editing or adjustments.",
                    answer_id: 'graphics-5-a-3',
                    value: 3,
                },
                {
                    answer: "No files were provided.",
                    answer_id: 'graphics-5-a-4',
                    value: 0,
                }],
        },
        {
            question: "Technical quality of graphics was?",
            question_id: 'graphics-6',
            answers: [
                {
                    answer: "Excellent, no mistakes within the design.",
                    answer_id: 'graphics-6-a-1',
                    value: 10,
                },
                {
                    answer: "Very good with minor mistakes that are visible in the provided files.",
                    answer_id: 'graphics-6-a-2',
                    value: 5,
                },
                {
                    answer: "Good but the design has some more serious flaws that need to be corrected. ",
                    answer_id: 'graphics-6-a-3',
                    value: 3,
                },
                {
                    answer: "Bad. The design does not follow graphics standard and is barely usable.",
                    answer_id: 'graphics-6-a-4',
                    value: 0,
                }],
        },
    ]
};