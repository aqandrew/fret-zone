import React from 'react';
import clsx from 'clsx';

import './TabBar.scss';

// TODO Should this be a series of NavLinks?
const TabBar = ({ files, activeFileName, setActiveFileName }) => (
	<ol className="TabBar">
		{files.map((file) => {
			const baseClassName = 'TabBar__Tab';

			return (
				<li
					className={clsx(
						baseClassName,
						file.name === activeFileName && `${baseClassName}--IsActive`
					)}
					onClick={(event) => {
						if (!(event.target instanceof HTMLButtonElement)) {
							setActiveFileName(file.name);
						}
					}}
					key={file.id}
				>
					{file.name || 'untitled'}
					<button className="TabBar__Button--Close">Close</button>
				</li>
			);
		})}
		{/* TODO On click, open context menu for selecting New/Open */}
		<li className="TabBar__Button--AddTab">+</li>
	</ol>
);
export default TabBar;
