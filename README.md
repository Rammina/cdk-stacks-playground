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

Navigate to the `/lib` directory, which contains the different CDK stacks that you can use to deploy AWS resources and architectures.

Select a stack that you want to deploy and open its corresponding .ts file.

Update the stack's configuration, such as the AWS region, resource properties, and any other relevant settings.

If it's your first time deploying AWS CDK stacks, you need to bootstrap the necessary resources with this command:

```sh
cdk bootstrap
```

Synthesize the AWS CloudFormation template from the CDK using the following command:

```sh
cdk synth
```

Deploy the stack using the following command:

```sh
cdk deploy
```


If you want to destroy the stack after you're done experimenting, use the following command:

```sh
cdk destroy
```

## Contributing
If you want to contribute to the AWS CDK v2 Typescript Playground, please create a pull request with your proposed changes. We welcome contributions of all kinds, including bug fixes, new features, and improvements to the documentation.

## License
This repository is licensed under the MIT License.
