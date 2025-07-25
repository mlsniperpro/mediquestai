# Firebase Cloud Functions Project

This is a fresh Firebase Cloud Functions project set up with TypeScript.

## Project Structure

```
├── src/
│   └── index.ts          # Main functions file
├── lib/                  # Compiled JavaScript (auto-generated)
├── firebase.json         # Firebase configuration
├── .firebaserc          # Firebase project configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Node.js dependencies and scripts
└── README.md           # This file
```

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure your Firebase project:**
   - Update `.firebaserc` with your actual Firebase project ID
   - Or run `firebase use --add` to select a project

3. **Build the project:**
   ```bash
   pnpm run build
   ```

## Available Scripts

- `pnpm run build` - Compile TypeScript to JavaScript
- `pnpm run build:watch` - Watch for changes and auto-compile
- `pnpm run serve` - Start local Firebase emulator
- `pnpm run deploy` - Deploy functions to Firebase
- `pnpm run logs` - View function logs
- `pnpm run shell` - Start Firebase functions shell

## Example Functions

The project includes three example functions:

1. **helloWorld** - HTTP trigger function
2. **onUserCreate** - Firestore trigger function
3. **dailyCleanup** - Scheduled function (cron job)

## Local Development

To test your functions locally:

```bash
pnpm run serve
```

This will start the Firebase emulator suite. You can then:
- Test HTTP functions at `http://localhost:5001/your-project-id/us-central1/helloWorld`
- Use the Emulator UI at `http://localhost:4000`

## Deployment

1. Make sure you're logged in to Firebase:
   ```bash
   firebase login
   ```

2. Deploy your functions:
   ```bash
   pnpm run deploy
   ```

## Environment Variables

For production secrets, use Firebase environment configuration:

```bash
firebase functions:config:set someservice.key="THE API KEY"
```

Access in your code:
```typescript
const apiKey = functions.config().someservice.key;
```

## Next Steps

1. Update `.firebaserc` with your actual Firebase project ID
2. Customize the example functions in `src/index.ts`
3. Add additional function files as needed
4. Set up proper error handling and logging
5. Configure environment variables for production