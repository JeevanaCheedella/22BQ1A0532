import React from 'react';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { URLInput as URLInputType } from '../types';

interface URLInputProps {
  urlInput: URLInputType;
  index: number;
  onUpdate: (index: number, field: keyof URLInputType, value: string | number) => void;
  onDelete: (index: number) => void;
  canDelete: boolean;
}

const URLInput: React.FC<URLInputProps> = ({
  urlInput,
  index,
  onUpdate,
  onDelete,
  canDelete
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            URL #{index + 1}
          </Typography>
          {canDelete && (
            <IconButton
              onClick={() => onDelete(index)}
              color="error"
              size="small"
              aria-label={`Delete URL input ${index + 1}`}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Original URL"
              placeholder="https://example.com/very-long-url"
              value={urlInput.originalUrl}
              onChange={(e) => onUpdate(index, 'originalUrl', e.target.value)}
              error={!!urlInput.errors.originalUrl}
              helperText={urlInput.errors.originalUrl}
              required
              autoComplete="off"
              aria-label="Original URL"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Validity Period (minutes)"
              type="number"
              value={urlInput.validityMinutes}
              onChange={(e) => onUpdate(index, 'validityMinutes', parseInt(e.target.value) || 30)}
              error={!!urlInput.errors.validityMinutes}
              helperText={urlInput.errors.validityMinutes || 'Default: 30 minutes'}
              inputProps={{ min: 1, max: 10080, step: 1 }}
              autoComplete="off"
              aria-label="Validity Period (minutes)"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              placeholder="my-custom-link"
              value={urlInput.customShortcode}
              onChange={(e) => onUpdate(index, 'customShortcode', e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              error={!!urlInput.errors.customShortcode}
              helperText={urlInput.errors.customShortcode || 'Leave empty for auto-generation'}
              inputProps={{ maxLength: 20, pattern: '[a-zA-Z0-9]*' }}
              autoComplete="off"
              aria-label="Custom Shortcode"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default URLInput;