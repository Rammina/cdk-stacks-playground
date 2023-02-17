# AWS CDK v2 Typescript Playground

This repository is a playground for exploring the AWS Cloud Development Kit (CDK) v2 in TypeScript. It provides a simple setup for experimenting with different CDK stacks and deploying AWS resources and entire architectures.

## Prerequisites

Before getting started with the AWS CDK v2 Typescript Playground, you need to have the following prerequisites installed on your local machine:

- Node.js (v14 or higher)
- AWS CLI (configured with your AWS account)

## Installation

Clone this repository to your local machine:

```sh
git clone https://github.com/your-username/aws-cdk-v2-typescript-playground.git
```

Install the required dependencies:

```sh
cd aws-cdk-v2-typescript-playground
npm install
```

## Usage

Navigate to the /lib directory, which contains the different CDK stacks that you can use to deploy AWS resources and architectures.

Select a stack that you want to deploy and open its corresponding .ts file.

Update the stack's configuration, such as the AWS region, resource properties, and any other relevant settings.

Deploy the stack using the following command:

```sh
npm run deploy -- -c stackName=<your-stack-name> -c env=<your-environment-name>
```

Make sure to replace <your-stack-name> with a unique name for your stack, and <your-environment-name> with the name of the AWS environment you want to deploy to (e.g., dev, staging, prod).

If you want to destroy the stack after you're done experimenting, use the following command:

```sh
npm run destroy -- -c stackName=<your-stack-name> -c env=<your-environment-name>
```

## Contributing
If you want to contribute to the AWS CDK v2 Typescript Playground, please create a pull request with your proposed changes. We welcome contributions of all kinds, including bug fixes, new features, and improvements to the documentation.

## License
This repository is licensed under the MIT License.
