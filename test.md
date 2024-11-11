name: Node.js CI

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Install Dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Start Server
      run: node your-server-file.js