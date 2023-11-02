import Modal from './Modal';

import './KeyboardShortcutsModal.scss';

const KEYBOARD_SHORTCUTS = [
	{
		desc: 'Add note',
		shortcutHTML: 'Any number <kbd>0</kbd> - <kbd>63</kbd>',
	},
	{
		desc: 'Add rest',
		shortcut: 'R',
	},
	{
		desc: 'Move measure/note selection',
		shortcut: ['Left', 'Right'],
	},
	{
		desc: 'Move string',
		shortcut: ['Up', 'Down'],
	},
	{
		desc: 'Lengthen note duration',
		shortcut: '-',
	},
	{
		desc: 'Shorten note duration',
		shortcut: ['+', '='],
	},
	{
		desc: 'Delete note/rest',
		shortcut: 'Backspace',
	},
	{
		desc: 'Delete measure',
		shortcutChord: ['Ctrl', '-'],
	},
	{
		desc: 'Add track',
		shortcutChord: ['Cmd', 'Alt', 'N'],
	},
	{
		desc: 'Remove track',
		shortcutChord: ['Cmd', 'Alt', 'R'],
	},
];

export default function KeyboardShortcutsModal({ show, onClose }) {
	return (
		// TODO only OK button is necessary
		<Modal
			modalTitle="Keyboard shortcuts"
			show={show}
			onClose={onClose}
			onConfirm={onClose}
		>
			<p>
				<strong>Note:</strong> Currently, only macOS is supported.
			</p>
			<table className="KeyboardShortcutsModal__Table">
				<tbody>
					{KEYBOARD_SHORTCUTS.map(
						({ desc, shortcut, shortcutChord, shortcutHTML }) => {
							return (
								<tr key={desc}>
									<td>{desc}</td>
									{shortcut ? (
										<td>
											{Array.isArray(shortcut) ? (
												<KeyListOfChoices>{shortcut}</KeyListOfChoices>
											) : (
												shortcut
											)}
										</td>
									) : shortcutChord ? (
										<td>
											<KeyListChord>{shortcutChord}</KeyListChord>
										</td>
									) : (
										<td dangerouslySetInnerHTML={{ __html: shortcutHTML }} />
									)}
								</tr>
							);
						}
					)}
				</tbody>
			</table>
		</Modal>
	);
}

function KeyListOfChoices({ children }) {
	return <KeyList separator="/">{children}</KeyList>;
}

function KeyListChord({ children }) {
	return <KeyList separator=" ">{children}</KeyList>;
}

function KeyList({ children, separator }) {
	return children.map((k, i) => (
		<kbd key={k}>
			{k}
			{i < children.length - 1 ? separator : null}
		</kbd>
	));
}
