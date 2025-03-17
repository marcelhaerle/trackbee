import { saveTimeEntryHandler } from "@/actions/timeEntry";
import { DateTimePicker } from "@/components/date-time-picker";
import Link from "next/link";

interface TimeEntryEditProps {
  timeEntry: {
    id: string;
    description: string | null;
    startTime: Date;
    endTime: Date;
    projectId: string;
  };
}

export default function TimeEntryEditForm({ timeEntry }: TimeEntryEditProps) {
  return (
    <div className="container">
      <div className="box">
        <h1 className="title is-4">Edit Time Entry</h1>
        <form className="mt-4" action={saveTimeEntryHandler}>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="What are you working on?"
                defaultValue={timeEntry.description || ""}
                name="description"
              />
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <DateTimePicker
                initialDate={timeEntry.startTime || new Date()}
                label="Start Time"
                required
                name="startTime"
              />
            </div>

            <div className="column">
              <DateTimePicker
                initialDate={timeEntry.endTime || new Date()}
                label="End Time"
                name="endTime"
              />
            </div>
          </div>

          <div className="field is-grouped is-grouped-right mt-5">
            <div className="control">
              <Link href="/dashboard" className="button is-light">
                Cancel
              </Link>
            </div>
            <div className="control">
              <button type="submit" className={`button is-primary `}>
                Save Changes
              </button>
            </div>
          </div>

          <input type="hidden" name="id" value={timeEntry.id} />
          <input type="hidden" name="projectId" value={timeEntry.projectId} />
        </form>
      </div>
    </div>
  );
}
