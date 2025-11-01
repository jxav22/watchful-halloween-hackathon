# How to Enable DALL-E Access for Your OpenAI API Key

## Steps to Enable DALL-E 3

### 1. Check Your OpenAI Account
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Log in to your account
3. Navigate to **Settings** → **Organization** → **Limits**

### 2. Verify API Access
- DALL-E 3 is typically available by default for paid accounts
- Free tier accounts may have limited or no access to DALL-E

### 3. Check Billing Setup
1. Go to **Settings** → **Billing**
2. Ensure you have:
   - A valid payment method added
   - Available credits/balance
   - DALL-E enabled in your subscription

### 4. API Key Requirements
- Your API key should automatically have access to all models you're subscribed to
- The same API key used for GPT models should work for DALL-E

### 5. Test DALL-E Access
You can test if your API key has DALL-E access by making a test request:

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A cute cat",
    "n": 1,
    "size": "1024x1024"
  }'
```

### Common Issues:

1. **"Model not found" or "Access denied"**
   - Your account may not have DALL-E access enabled
   - Check your subscription tier
   - Contact OpenAI support if you have a paid account

2. **Billing Issues**
   - Ensure you have credits/balance
   - DALL-E 3 costs approximately $0.04 per image (1024x1024, standard quality)
   - Check your usage limits

3. **Rate Limits**
   - DALL-E 3 may have different rate limits than GPT models
   - Check your organization settings for rate limits

### Alternative: Check in OpenAI Dashboard
1. Go to [Usage Dashboard](https://platform.openai.com/usage)
2. Check if DALL-E requests appear in your usage
3. If you see errors, they'll be listed with details

## For Your Current Setup

Your API key is stored in `.env` file:
```
OPENAI_API_KEY=sk-proj-...
```

If DALL-E is not working:
1. Verify the API key is correct
2. Check billing/payment method
3. Ensure account has DALL-E access (paid tier required)
4. Test with the curl command above

