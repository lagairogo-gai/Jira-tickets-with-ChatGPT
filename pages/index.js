import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [ticketDescription, setTicketDescription] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketDescription: ticketDescription }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setTicketDescription("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function createTicket() {
    console.log(result, 'RESULT')
    const jiraTicketTitle = result.match('Title: .*')[0]
    // TODO remove title from content, REGEX?
    const jiraTicketContent = result

    try {
      const response = await fetch("/api/create-jira-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          jiraTicketTitle,
          jiraTicketContent
       }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setTicketCreationStatus(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Create User Story</title>
        <link rel="icon" href="/jira.jpg" />
      </Head>

      <main className={styles.main}>
        <img src="/jira.jpg" className={styles.icon} />
        <h3>Hello Product Owner, what's on your mind?</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="ticket-description"
            placeholder="Enter your requirement"
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
          />
          <input type="submit" value="Generate User Story" />
        </form>
        <div className={styles.result}>{result}</div>
        <button className={styles["create-ticket-button"]} onClick={createTicket}>Post To Jira</button>
      </main>
    </div>
  );
}
