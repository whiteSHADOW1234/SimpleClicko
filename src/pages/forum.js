import React, { useState } from "react";
import "./forum.css";

function Forum() {
    const [discussion, setDiscussion] = useState({
        "How to make a good coffee?": "I am a coffee lover and I want to make a good coffee at home. Can anyone help me with the recipe?",
        "Any suggestions for buying coffee machine?": "I am planning to buy a coffee machine for my home. Can anyone suggest me a good coffee machine?",
        "Why does coffee smell like soy sauce?": "I have noticed that coffee smells like soy sauce. Can anyone tell me the reason behind it?",
        "EMPTY": "I am a coffee lover and I want to make a good coffee at home. Can anyone help me with the recipe?",
        "HELLO?": "I am planning to buy a coffee machine for my home. Can anyone suggest me a good coffee machine?",
    });

    const [selectedProperties, setSelectedProperties] = useState([]);
    const [showAddWindow, setShowAddWindow] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedDiscussionProperties, setSelectedDiscussionProperties] = useState({});

    // Function to handle property selection
    const handlePropertySelection = (property) => {
        if (selectedProperties.includes(property)) {
            setSelectedProperties(selectedProperties.filter(p => p !== property));
        } else {
            setSelectedProperties([...selectedProperties, property]);
        }
    }

    const Add_discussion = () => {
        setShowAddWindow(true); // Show the add_window when Add Discussion button is clicked
    }

    const cancelAddDiscussion = () => {
        setShowAddWindow(false); // Hide the add_window
        setTitle("");
        setContent("");
        setSelectedProperties([]);
    }

    const [selectedDiscussions, setSelectedDiscussions] = useState([]);

    // Function to toggle selected discussion
    const toggleDiscussion = (title) => {
        if (selectedDiscussions.includes(title)) {
            setSelectedDiscussions(selectedDiscussions.filter(item => item !== title));
        } else {
            setSelectedDiscussions([...selectedDiscussions, title]);
        }
    };

    // Function to delete selected discussions
    const deleteSelectedDiscussions = () => {
        const updatedDiscussion = { ...discussion };
        selectedDiscussions.forEach(title => {
            delete updatedDiscussion[title];
        });
        setDiscussion(updatedDiscussion);
        setSelectedDiscussions([]);
    };

    const Add_Comment = () => {
        if (title && content) {
            const updatedDiscussion = { ...discussion };
            updatedDiscussion[title] = content;
            setDiscussion(updatedDiscussion);
            setShowAddWindow(false);
            setSelectedDiscussionProperties(prevState => ({
                ...prevState,
                [title]: selectedProperties
            }));
            setTitle("");
            setContent("");
            setSelectedProperties([]);
        }
    }

    return (
        <div className="forum_bg">
            <div className={`forum_container ${showAddWindow ? 'blurred' : ''}`}>
                <span className="forum_title">Discussion</span>
                <div className="forum_discussion">
                    <ul className="discussion_list">
                        {Object.keys(discussion).map((key, index) => {
                            return (
                                <li key={index} className="discussion_block">
                                    <input
                                        type="checkbox"
                                        checked={selectedDiscussions.includes(key)}
                                        onChange={() => toggleDiscussion(key)}
                                    />
                                    <a href="/#" className="discussion_title">{key}</a>
                                    
                                    {/* Display selected properties for the added discussion */}
                                    {selectedDiscussionProperties[key] &&
                                        <div className="selected_properties">
                                            {selectedDiscussionProperties[key].map((property, index) => (
                                                <span key={index}>{property}</span>
                                            ))}
                                        </div>
                                    }
                                    
                                    <span className="discussion_state">
                                        <i className="fa fa-comment"></i>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <button onClick={Add_discussion} className="add_discussion">Add Discussion</button>
                <button onClick={deleteSelectedDiscussions} className="del_discussion" >Delete Discussion</button>
            </div>
            {showAddWindow && (
                <div className="add_window">
                    <p>
                        <h1 className="problem_title">Enter your problem : </h1>
                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <h1 className="problem_content">Enter Content : </h1>
                        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                        <span>Choose property</span>
                        <div className="property-buttons">
                            <button className={selectedProperties.includes("Property 1") ? "selected" : ""} onClick={() => handlePropertySelection("Property 1")}>Property 1</button>
                            <button className={selectedProperties.includes("Property 2") ? "selected" : ""} onClick={() => handlePropertySelection("Property 2")}>Property 2</button>
                            <button className={selectedProperties.includes("Property 3") ? "selected" : ""} onClick={() => handlePropertySelection("Property 3")}>Property 3</button>
                        </div>
                        <button className="add_window_confirm" onClick={Add_Comment}>Confirm</button>
                        <button className="close_add_window" onClick={cancelAddDiscussion}>Cancel</button>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Forum;
