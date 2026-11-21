# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Firestore storage maintenance

The Spool production database is `spool-a5020` / `(default)`. This repository's `firestore.indexes.json` records the four composite indexes present on November 21, 2026 and the refund field exemptions. Review index changes alongside the queries that need them. Apple and support review use the composite index on `_serverRefundEvidence(source_rc_id, occurred_at_ms)`. Batched Focus Web review uses the single-field `minute_ms` index. Receipt deduplication and terms history use document IDs.

For a monthly review, or after a significant change in storage, run these commands in Cloud Shell or another environment with Node 20+ and an authenticated Google Cloud CLI. Use different snapshot filenames for each review.

```sh
node scripts/firestore-storage-report.mjs --save "$HOME/spool-storage-before.json"
node scripts/firestore-storage-report.mjs --previous "$HOME/spool-storage-before.json" --save "$HOME/spool-storage-after.json"
```

The report reads Google's aggregate database and collection statistics. Snapshot dates can lag the live database. Compare snapshots with different timestamps and check which collection and index category actually changed. Keep snapshots outside the repository. A periodic full scan of customer documents adds read costs and is unnecessary for this report.

Before exempting a field, check filters and sorting in released clients, deployed functions, support tools and reports. Compare the declared index configuration with a fresh export from `firebase firestore:indexes --project spool-a5020 --database '(default)'`. Apply only the intended changes, wait for the Firestore operations to finish, and verify the affected live queries. To re-enable default indexing for an exempt field, remove that field override and wait for its indexes to rebuild before shipping a query that relies on it.

Index maintenance preserves document fields. Treat record expiry as a separate decision. Refund retries use operation receipts, withdrawal checks use consent history, and transaction-specific Apple and support review reads evidence from the purchase period. A proposed expiry needs a documented last consumer, a bound on delayed uses, and a test for replay of an old request. If storage growth is driven by indexes, address those first.
