import React, { ReactElement } from "react";

interface NotesRowProps {
  notes: string;
}

export default function NotesRow({ notes }: NotesRowProps): ReactElement {
  return <p style={{ margin: 0 }}>{notes}</p>;
}
