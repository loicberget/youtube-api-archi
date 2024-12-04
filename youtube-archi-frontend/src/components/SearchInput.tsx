import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";

interface SearchInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onSearch: () => void;
}

export const SearchInput = ({ inputRef, onSearch }: SearchInputProps) => (
  <>
    <Grid size={10}>
      <TextField
        label="Channel Name"
        variant="outlined"
        fullWidth
        inputRef={inputRef}
      />
    </Grid>
    <Grid size={2}>
      <IconButton onClick={onSearch}>
        <SendIcon />
      </IconButton>
    </Grid>
  </>
);
