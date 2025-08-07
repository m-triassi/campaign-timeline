import React, { useState, useEffect, useCallback, useMemo } from "react";

// --- Helper Functions ---
const TIME_UNITS = {
    hours: 1,
    days: 24,
    weeks: 24 * 7,
    months: 24 * 30, // Simplified for campaign tracking
};

// Converts a time object to total hours
const toTotalHours = (time) => {
    return (
        time.years * 12 * 30 * 24 +
        time.months * 30 * 24 +
        time.days * 24 +
        time.hours
    );
};

// Converts total hours to a time object
const fromTotalHours = (totalHours) => {
    let remainingHours = totalHours;
    const years = Math.floor(remainingHours / (12 * 30 * 24));
    remainingHours %= 12 * 30 * 24;
    const months = Math.floor(remainingHours / (30 * 24));
    remainingHours %= 30 * 24;
    const days = Math.floor(remainingHours / 24);
    remainingHours %= 24;
    const hours = Math.floor(remainingHours);
    return { years, months, days, hours };
};

// --- React Components ---

// Displays the current campaign time
const TimeDisplay = ({ time }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center mb-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-400 mb-2 tracking-wider uppercase">
            Campaign Time
        </h2>
        <div className="flex justify-center items-baseline space-x-2 sm:space-x-4 flex-wrap">
            <div className="text-center mx-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">
                    {time.years}
                </span>
                <span className="text-lg sm:text-xl text-gray-300 ml-2">
                    Years
                </span>
            </div>
            <div className="text-center mx-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">
                    {time.months}
                </span>
                <span className="text-lg sm:text-xl text-gray-300 ml-2">
                    Months
                </span>
            </div>
            <div className="text-center mx-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">
                    {time.days}
                </span>
                <span className="text-lg sm:text-xl text-gray-300 ml-2">
                    Days
                </span>
            </div>
            <div className="text-center mx-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">
                    {time.hours}
                </span>
                <span className="text-lg sm:text-xl text-gray-300 ml-2">
                    Hours
                </span>
            </div>
        </div>
    </div>
);

// Controls for adding time to the campaign
const TimeControls = ({ onAddTime }) => {
    const [value, setValue] = useState(1);
    const [unit, setUnit] = useState("hours");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value > 0) {
            onAddTime(value * TIME_UNITS[unit]);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-700">
            <h3 className="text-md font-semibold text-gray-400 mb-4 tracking-wider uppercase">
                Advance Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preset Buttons */}
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => onAddTime(1)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Short Rest (1 Hour)
                    </button>
                    <button
                        onClick={() => onAddTime(8)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Long Rest (8 Hours)
                    </button>
                    <button
                        onClick={() => onAddTime(4)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        A Watch (4 Hours)
                    </button>
                </div>
                {/* Custom Input Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-2 p-4 bg-gray-700/50 rounded-lg"
                >
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                                setValue(parseInt(e.target.value, 10) || 1)
                            }
                            min="1"
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="p-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            {Object.keys(TIME_UNITS).map((u) => (
                                <option key={u} value={u}>
                                    {u.charAt(0).toUpperCase() + u.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Add Custom Time
                    </button>
                </form>
            </div>
        </div>
    );
};

// Form for adding or editing a key decision/event
const EventForm = ({
    onAddEvent,
    onUpdateEvent,
    editingEvent,
    onCancelEdit,
    onDelete,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timeRemaining, setTimeRemaining] = useState("");
    const isEditing = editingEvent !== null;

    useEffect(() => {
        if (isEditing) {
            setTitle(editingEvent.title);
            setDescription(editingEvent.description);
            setTimeRemaining(editingEvent.timeRemaining || "");
        } else {
            setTitle("");
            setDescription("");
            setTimeRemaining("");
        }
    }, [editingEvent, isEditing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;
        const eventData = {
            title,
            description,
            timeRemaining: timeRemaining ? parseInt(timeRemaining, 10) : null,
        };
        if (isEditing) {
            onUpdateEvent(eventData);
        } else {
            onAddEvent(eventData);
            // Reset form fields after adding a new event
            setTitle("");
            setDescription("");
            setTimeRemaining("");
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-md font-semibold text-gray-400 mb-4 tracking-wider uppercase">
                {isEditing ? "Edit Event" : "Add Key Decision"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                    type="number"
                    placeholder="Optional: Time Remaining (in hours)"
                    value={timeRemaining}
                    onChange={(e) => setTimeRemaining(e.target.value)}
                    min="1"
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="flex items-center gap-4">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    >
                        {isEditing ? "Save Changes" : "Add to Timeline"}
                    </button>
                </div>
                {isEditing && (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Delete Event
                    </button>
                )}
            </form>
        </div>
    );
};

// Component to handle expandable text
const ExpandableText = ({ text, maxLength = 120 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text || text.length === 0) {
        return null;
    }

    if (text.length <= maxLength) {
        return (
            <p className="text-gray-300 break-words whitespace-pre-wrap">
                {text}
            </p>
        );
    }

    return (
        <div>
            <p className="text-gray-300 break-words whitespace-pre-wrap">
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            </p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-400 hover:text-indigo-300 text-sm mt-1 font-semibold"
            >
                {isExpanded ? "Read Less" : "Read More"}
            </button>
        </div>
    );
};

// Visual timeline component
const Timeline = ({ events, onStartEdit }) => {
    const sortedEvents = useMemo(
        () => [...events].sort((a, b) => a.timeCreated - b.timeCreated),
        [events],
    );

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col w-full h-full">
            <h3 className="text-md font-semibold text-gray-400 mb-4 tracking-wider uppercase text-center flex-shrink-0">
                Timeline
            </h3>
            <div className="relative overflow-y-auto flex-grow -mr-4 pr-4 min-h-0">
                {events.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-gray-400">
                        <p>
                            No events added yet. Add a key decision to begin
                            your timeline.
                        </p>
                    </div>
                ) : (
                    <div className="relative pl-8">
                        <div className="absolute top-0 bottom-0 left-4 w-1 bg-gray-600"></div>

                        {sortedEvents.map((event) => {
                            const createdTime = fromTotalHours(
                                event.timeCreated,
                            );
                            const isTimed =
                                event.timeRemaining !== null &&
                                event.timeRemaining !== undefined;
                            const isExpired =
                                isTimed && event.timeRemaining <= 0;

                            return (
                                <div key={event.id} className="relative mb-8">
                                    <div
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full z-10 border-4 ${isExpired ? "bg-red-500 border-red-300" : isTimed ? "bg-yellow-500 border-yellow-300" : "bg-blue-500 border-blue-300"}`}
                                    ></div>

                                    <div className="ml-8 p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-lg text-white pr-2">
                                                {event.title}
                                            </h4>
                                            <button
                                                onClick={() =>
                                                    onStartEdit(event)
                                                }
                                                title="Edit Event"
                                                className="p-1 text-gray-400 hover:text-white flex-shrink-0"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">
                                            Created at: {createdTime.years}y,{" "}
                                            {createdTime.months}m,{" "}
                                            {createdTime.days}d,{" "}
                                            {createdTime.hours}h
                                        </p>
                                        <ExpandableText
                                            text={event.description}
                                        />
                                        {isTimed && (
                                            <div
                                                className={`mt-2 p-2 rounded-md text-sm font-semibold ${isExpired ? "bg-red-900/50 text-red-300" : "bg-yellow-900/50 text-yellow-300"}`}
                                            >
                                                {isExpired
                                                    ? "Time Expired!"
                                                    : `${event.timeRemaining} hours remaining`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 max-w-sm mx-auto">
                <p className="text-white text-lg mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// Handles importing and exporting data
const DataManager = ({ data, onImport, onClear }) => {
    const exportData = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "dnd-timeline.json";
        link.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (importedData.time && importedData.events) {
                    onImport(importedData);
                } else {
                    alert(
                        "Invalid JSON file. Make sure it has 'time' and 'events' properties.",
                    );
                }
            } catch (error) {
                alert("Error parsing JSON file.");
                console.error("JSON parsing error:", error);
            }
        };
        reader.readAsText(file);
        e.target.value = null; // Reset file input
    };

    return (
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex items-center justify-center space-x-4">
            <button
                onClick={exportData}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                Export to JSON
            </button>
            <label className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 cursor-pointer">
                Import from JSON
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
            <button
                onClick={onClear}
                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                Clear Timeline
            </button>
        </div>
    );
};

// Main App Component
function App() {
    const [time, setTime] = useState({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
    });
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    // Load state from localStorage on initial render
    useEffect(() => {
        try {
            const savedState = localStorage.getItem("dndTimelineState");
            if (savedState) {
                const { time: savedTime, events: savedEvents } =
                    JSON.parse(savedState);
                if (savedTime && savedEvents) {
                    setTime(savedTime);
                    setEvents(savedEvents);
                }
            }
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
        }
        setIsLoading(false);
    }, []);

    // Save state to localStorage whenever it changes, but not during the initial load
    useEffect(() => {
        if (isLoading) {
            return; // Don't save to localStorage until the initial state has been loaded.
        }
        try {
            const stateToSave = JSON.stringify({ time, events });
            localStorage.setItem("dndTimelineState", stateToSave);
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [time, events, isLoading]);

    const handleAddTime = useCallback(
        (hoursToAdd) => {
            const currentTotalHours = toTotalHours(time);
            const newTotalHours = currentTotalHours + hoursToAdd;
            setTime(fromTotalHours(newTotalHours));

            setEvents((prevEvents) =>
                prevEvents.map((event) => {
                    if (
                        event.timeRemaining !== null &&
                        event.timeRemaining > 0
                    ) {
                        return {
                            ...event,
                            timeRemaining: Math.max(
                                0,
                                event.timeRemaining - hoursToAdd,
                            ),
                        };
                    }
                    return event;
                }),
            );
        },
        [time],
    );

    const handleAddEvent = useCallback(
        (newEventData) => {
            const currentTotalHours = toTotalHours(time);
            const newEvent = {
                ...newEventData,
                id: Date.now(), // Unique ID for the event
                timeCreated: currentTotalHours,
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        },
        [time],
    );

    const handleStartEdit = (event) => {
        setEditingEvent(event);
    };

    const handleCancelEdit = () => {
        setEditingEvent(null);
    };

    const handleUpdateEvent = (updatedData) => {
        const originalEvent = events.find((e) => e.id === editingEvent.id);
        if (!originalEvent) return;

        // Adjust time remaining based on elapsed time since creation
        if (
            updatedData.timeRemaining !== null &&
            updatedData.timeRemaining !== undefined
        ) {
            const currentCampaignTime = toTotalHours(time);
            const timeElapsedSinceCreation =
                currentCampaignTime - originalEvent.timeCreated;
            const adjustedTimeRemaining = Math.max(
                0,
                updatedData.timeRemaining - timeElapsedSinceCreation,
            );
            updatedData.timeRemaining = adjustedTimeRemaining;
        }

        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === editingEvent.id
                    ? { ...event, ...updatedData }
                    : event,
            ),
        );
        setEditingEvent(null);
    };

    const handleDeleteRequest = () => {
        setEventToDelete(editingEvent);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteEvent = () => {
        if (!eventToDelete) return;
        setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventToDelete.id),
        );
        setEventToDelete(null);
        setIsDeleteModalOpen(false);
        setEditingEvent(null); // Exit edit mode after deleting
    };

    const handleImport = (importedData) => {
        setTime(importedData.time);
        setEvents(importedData.events);
    };

    const handleClear = () => {
        setTime({ years: 0, months: 0, days: 0, hours: 0 });
        setEvents([]);
        setIsClearModalOpen(false);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={handleClear}
                message="Are you sure you want to delete all timeline data? This action cannot be undone."
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteEvent}
                message={`Are you sure you want to delete the event "${eventToDelete?.title}"? This action cannot be undone.`}
            />
            <div className="bg-gray-900 text-white h-screen font-sans flex flex-col">
                <header className="text-center p-4 sm:p-6 lg:py-8 flex-shrink-0">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            D&D Campaign Tracker
                        </h1>
                    </div>
                </header>

                {/* Main content area uses CSS Grid on large screens for robust layout */}
                <main className="flex-grow min-h-0 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid gap-6 lg:grid-cols-3 lg:grid-rows-[1fr_auto]">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6 overflow-y-auto min-h-0 pr-2">
                        <TimeDisplay time={time} />
                        <TimeControls onAddTime={handleAddTime} />
                        <EventForm
                            onAddEvent={handleAddEvent}
                            onUpdateEvent={handleUpdateEvent}
                            editingEvent={editingEvent}
                            onCancelEdit={handleCancelEdit}
                            onDelete={handleDeleteRequest}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 flex flex-col min-h-0">
                        <Timeline
                            events={events}
                            onStartEdit={handleStartEdit}
                        />
                    </div>

                    {/* Data Manager Row */}
                    <div className="lg:col-span-3 p-3">
                        <DataManager
                            data={{ time, events }}
                            onImport={handleImport}
                            onClear={() => setIsClearModalOpen(true)}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}

export default App;
