import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import { Add, Link as LinkIcon } from '@mui/icons-material';
import { URLInput as URLInputType, ShortenedURL } from '../types';
import { useURLShortener } from '../context/URLShortenerContext';
import URLInput from '../components/URLInput';
import ShortenedURLResult from '../components/ShortenedURLResult';
import { validateUrl, validateValidityMinutes, validateShortcode, generateShortcode } from '../utils/validation';
import { logger } from '../../../logging-middleware';

const URLShortenerPage: React.FC = () => {
  const { addShortenedUrl, isShortcodeUnique } = useURLShortener();
  const [urlInputs, setUrlInputs] = useState<URLInputType[]>([
    {
      id: '1',
      originalUrl: '',
      validityMinutes: 30,
      customShortcode: '',
      errors: {}
    }
  ]);
  const [results, setResults] = useState<ShortenedURL[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const addUrlInput = () => {
    if (urlInputs.length >= 5) {
      setWarning('You can only shorten up to 5 URLs at once.');
      logger.warn('Attempted to add more than 5 URL inputs');
      return;
    }
    setWarning(null);
    const newInput: URLInputType = {
      id: Date.now().toString(),
      originalUrl: '',
      validityMinutes: 30,
      customShortcode: '',
      errors: {}
    };
    setUrlInputs([...urlInputs, newInput]);
    logger.info('Added new URL input', { totalInputs: urlInputs.length + 1 });
  };

  const updateUrlInput = (index: number, field: keyof URLInputType, value: string | number) => {
    setUrlInputs(prev => 
      prev.map((input, i) => 
        i === index 
          ? { ...input, [field]: value, errors: { ...input.errors, [field]: undefined } }
          : input
      )
    );
    setWarning(null);
  };

  const deleteUrlInput = (index: number) => {
    setUrlInputs(prev => prev.filter((_, i) => i !== index));
    logger.info('Removed URL input', { index, remainingInputs: urlInputs.length - 1 });
    setWarning(null);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    const updatedInputs = urlInputs.map(input => {
      const errors: URLInputType['errors'] = {};
      
      const urlError = validateUrl(input.originalUrl);
      if (urlError) {
        errors.originalUrl = urlError;
        isValid = false;
      }
      
      const validityError = validateValidityMinutes(input.validityMinutes);
      if (validityError) {
        errors.validityMinutes = validityError;
        isValid = false;
      }
      
      const shortcodeError = validateShortcode(input.customShortcode);
      if (shortcodeError) {
        errors.customShortcode = shortcodeError;
        isValid = false;
      }
      
      if (input.customShortcode && !isShortcodeUnique(input.customShortcode)) {
        errors.customShortcode = 'This shortcode is already in use';
        isValid = false;
      }
      
      return { ...input, errors };
    });
    
    setUrlInputs(updatedInputs);
    return isValid;
  };

  const handleSubmit = async () => {
    setWarning(null);
    if (urlInputs.length === 0) {
      setWarning('Please add at least one URL to shorten.');
      logger.warn('Attempted to submit with no URL inputs');
      return;
    }
    if (!validateInputs()) {
      logger.warn('Form validation failed');
      return;
    }
    
    setIsSubmitting(true);
    const newResults: ShortenedURL[] = [];
    
    try {
      for (const input of urlInputs) {
        let shortcode = input.customShortcode.trim();
        
        if (!shortcode) {
          do {
            shortcode = generateShortcode();
          } while (!isShortcodeUnique(shortcode));
        }
        
        const createdAt = new Date();
        const expiryAt = new Date(createdAt.getTime() + input.validityMinutes * 60 * 1000);
        
        const shortenedUrl: ShortenedURL = {
          id: Date.now().toString() + Math.random(),
          originalUrl: input.originalUrl,
          shortenedUrl: `http://localhost:3000/s/${shortcode}`,
          shortcode,
          validityMinutes: input.validityMinutes,
          createdAt,
          expiryAt,
          clickCount: 0,
          clicks: []
        };
        
        addShortenedUrl(shortenedUrl);
        newResults.push(shortenedUrl);
      }
      
      setResults(newResults);
      logger.info('Successfully shortened URLs', { count: newResults.length });
      
      // Reset form
      setUrlInputs([{
        id: Date.now().toString(),
        originalUrl: '',
        validityMinutes: 30,
        customShortcode: '',
        errors: {}
      }]);
      
    } catch (error) {
      logger.error('Error shortening URLs', { error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinkIcon />
        URL Shortener
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Shorten up to 5 URLs at once with custom shortcodes and validity periods.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          URLs to Shorten
        </Typography>
        
        {urlInputs.map((input, index) => (
          <URLInput
            key={input.id}
            urlInput={input}
            index={index}
            onUpdate={updateUrlInput}
            onDelete={deleteUrlInput}
            canDelete={urlInputs.length > 1}
          />
        ))}

        {warning && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {warning}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {urlInputs.length < 5 && (
            <Button
              startIcon={<Add />}
              variant="outlined"
              onClick={addUrlInput}
              aria-label="Add another URL input"
            >
              Add Another URL ({urlInputs.length}/5)
            </Button>
          )}
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="large"
            aria-label="Shorten URLs"
          >
            {isSubmitting ? 'Shortening...' : 'Shorten URLs'}
          </Button>
        </Box>
      </Paper>

      {results.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shortened URLs
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {results.map((result) => (
            <ShortenedURLResult
              key={result.id}
              shortenedUrl={result}
            />
          ))}
          
          <Alert severity="success" sx={{ mt: 2 }}>
            Successfully shortened {results.length} URL{results.length > 1 ? 's' : ''}! 
            Check the Statistics page to track clicks and analytics.
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default URLShortenerPage;