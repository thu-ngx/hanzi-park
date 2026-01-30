interface NoteDisplayProps {
    note: string;
}

const NoteDisplay = ({ note }: NoteDisplayProps) => {
    return (
        <p className="text-xs text-muted-foreground flex-1 break-words whitespace-pre-wrap">
            {note || "No notes yet"}
        </p>
    );
};

export default NoteDisplay;
