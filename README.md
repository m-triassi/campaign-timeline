# D&D Campaign Timeline Tracker

A self-contained React application for tracking the passage of time and key events in a Dungeons & Dragons campaign. This tool helps Dungeon Masters and players maintain a coherent timeline, manage time-sensitive quests, and keep a persistent record of their campaign's history.

## Features

- **Dynamic Time Counter:** Track the campaign's time in years, months, days, and hours.
- **Quick Time Advancement:** Use preset buttons to add common time durations like a Short Rest (1 hour), Long Rest (8 hours), or a Watch (4 hours).
- **Custom Time Input:** Add any amount of time using a flexible form with hours, days, weeks, and months.
- **Event Timeline:** Visually map key decisions, plot points, and important events on a chronological timeline.
- **Time-Sensitive Events:** Add events with an optional "time remaining" countdown (in hours) that automatically decreases as time passes in the campaign.
- **Edit & Delete Events:** Easily modify or remove existing events directly from the timeline.
- **Persistent Storage:** All campaign data is automatically saved to the browser's local storage, so your timeline is preserved between sessions.
- **Data Portability:** Export your entire campaign timeline to a JSON file for backup or sharing, and import data from a file to restore a previous state.
- **Responsive Design:** A clean, intuitive interface that works on both desktop and mobile devices.

---

## Getting Started

This project was bootstrapped with Create React App and is designed to be a single, self-contained component. To get it running locally, you'll need Node.js and npm installed.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- A modern web browser

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/m-triassi/campaign-timeline.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd campaign-timeline
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the application:**
    ```bash
    npm start
    ```
    This will open the application in your default web browser at `http://localhost:5173`.

## Usage

1.  **Advancing Time:**
    - Use the "Short Rest," "Long Rest," or "A Watch" buttons for quick time additions.
    - For custom durations, enter a number, select a time unit (hours, days, etc.), and click "Add Custom Time."

2.  **Adding an Event:**
    - Fill out the "Add Key Decision" form with a **Title**, **Description**, and an optional **Time Remaining** (in hours).
    - Click "Add to Timeline." The event will appear on the timeline at the current campaign time.

3.  **Editing an Event:**
    - Click the pencil icon on any event card in the timeline.
    - The event's data will load into the form, which now enters "Edit Mode."
    - Make your changes and click "Save Changes."

4.  **Deleting an Event:**
    - While in "Edit Mode" for an event, a "Delete Event" button will appear at the bottom of the form.
    - Click it and confirm the action in the pop-up window to permanently remove the event.

5.  **Managing Data:**
    - **Export:** Click "Export to JSON" to download a `dnd-timeline.json` file of your current campaign state.
    - **Import:** Click "Import from JSON" and select a valid `.json` file to load a previously saved timeline. This will overwrite your current data.
    - **Clear:** Click "Clear Timeline" and confirm the action to reset the entire application to its initial state.


## Dependencies

This project relies on the following core libraries:

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.

All dependencies are managed via `npm` and are listed in the `package.json` file.


## Contributing

Contributions are welcome! If you have ideas for new features or have found a bug, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request


## License

Distributed under the MIT License. See `LICENSE` for more information.
