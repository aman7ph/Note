import React from 'react';
import ReactMde from 'react-mde';
import Showdown from 'showdown';

export default function Editor({ tempNoteText, settempNoteText }) {
    const [selectedTab, setSelectedTab] = React.useState('write');

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    });

    return (
        <section className="pane editor">
            <ReactMde
                value={tempNoteText}
                onChange={settempNoteText}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={80}
                heightUnits="vh"
            />
        </section>
    );
}
