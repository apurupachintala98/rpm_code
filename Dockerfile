# Use an official Node.js image as the base
FROM quay-nonprod.elevancehealth.com/multiarchitecture-golden-base-images/ubi8-nodejs-minimal:nodejs-20

# Set working directory inside the container
WORKDIR /app

# Copy source code into container
COPY ./source/ /app/

# Install dependencies
RUN npm install
RUN npm install --legacy-peer-deps
RUN npm install --save react-spinners
RUN npm install @mui/material @emotion/react @emotion/styled
RUN npm install @mui/material @mui/styled-engine-sc styled-components
RUN npm install @mui/icons-material
# Build the React app for production
RUN npm run build
# # Use a lightweight server to serve the build directory
# RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the built React app on port 3000
CMD ["npm", "run", "preview"]
