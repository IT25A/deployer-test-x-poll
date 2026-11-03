<script lang="ts">
	type QuestionType = 'single' | 'multiple' | 'text' | 'rating';

	type Question = {
		id: number;
		text: string;
		type: QuestionType;
		options: string[];
		editing: boolean;
	};

	const typeLabels: Record<QuestionType, string> = {
		single: 'Single choice',
		multiple: 'Multiple choice',
		text: 'Free text',
		rating: 'Rating (1-5)'
	};

	let title = $state('');
	let description = $state('');
	let questions = $state<Question[]>([]);
	let nextId = 1;

	function addQuestion() {
		questions.push({
			id: nextId++,
			text: '',
			type: 'single',
			options: ['', ''],
			editing: true
		});
	}

	function deleteQuestion(id: number) {
		questions = questions.filter((q) => q.id !== id);
	}

	function hasOptions(type: QuestionType) {
		return type === 'single' || type === 'multiple';
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const poll = {
			title,
			description,
			questions: questions.map(({ text, type, options }) => ({
				text,
				type,
				options: hasOptions(type) ? options.filter((o) => o.trim()) : []
			}))
		};
		console.log('Poll created:', poll);
	}
</script>

<main>
	<h1>Create a poll</h1>

	<form onsubmit={submit}>
		<label>
			Title
			<input type="text" bind:value={title} placeholder="Poll title" required />
		</label>

		<label>
			Description
			<textarea bind:value={description} rows="3" placeholder="What is this poll about?"></textarea>
		</label>

		<h2>Questions</h2>

		{#each questions as question, i (question.id)}
			<section class="question">
				{#if question.editing}
					<input
						type="text"
						bind:value={question.text}
						placeholder="Question {i + 1}"
						aria-label="Question text"
						required
					/>

					<select bind:value={question.type} aria-label="Question type">
						{#each Object.entries(typeLabels) as [value, label]}
							<option {value}>{label}</option>
						{/each}
					</select>

					{#if hasOptions(question.type)}
						<ul>
							{#each question.options as _, j}
								<li>
									<input
										type="text"
										bind:value={question.options[j]}
										placeholder="Option {j + 1}"
										aria-label="Option {j + 1}"
									/>
									<button
										type="button"
										onclick={() => question.options.splice(j, 1)}
										disabled={question.options.length <= 2}
									>
										Remove
									</button>
								</li>
							{/each}
						</ul>
						<button type="button" onclick={() => question.options.push('')}>Add option</button>
					{/if}
				{:else}
					<strong>{i + 1}. {question.text || '(untitled)'}</strong>
					<em>{typeLabels[question.type]}</em>
					{#if hasOptions(question.type)}
						<ul>
							{#each question.options.filter((o) => o.trim()) as option}
								<li>{option}</li>
							{/each}
						</ul>
					{/if}
				{/if}

				<div class="actions">
					<button type="button" onclick={() => (question.editing = !question.editing)}>
						{question.editing ? 'Done' : 'Edit'}
					</button>
					<button type="button" onclick={() => deleteQuestion(question.id)}>Delete</button>
				</div>
			</section>
		{:else}
			<p>No questions yet.</p>
		{/each}

		<button type="button" onclick={addQuestion}>+ Add question</button>
		<button type="submit" disabled={!title.trim() || questions.length === 0}>Create poll</button>
	</form>
</main>

<style>
	main {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.question {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin: 0;
		padding-left: 1rem;
	}

	li {
		display: flex;
		gap: 0.5rem;
	}

	li input {
		flex: 1;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}
</style>
