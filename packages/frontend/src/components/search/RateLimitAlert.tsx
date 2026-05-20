import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export interface RateLimitAlertProps {
  secondsRemaining: number;
}

export function RateLimitAlert({ secondsRemaining }: RateLimitAlertProps) {
  return (
    <Alert severity="warning" role="status" aria-live="polite">
      <Typography variant="body2">
        You&apos;ve reached the search limit. You can search again in{" "}
        <strong>{secondsRemaining}</strong>{" "}
        {secondsRemaining === 1 ? "second" : "seconds"}.
      </Typography>
    </Alert>
  );
}
