# AWS CDK v2 Typescript Playground

This repository is a playground for exploring the AWS Cloud Development Kit (CDK) v2 in TypeScript. It provides a simple setup for experimenting with different CDK stacks and deploying AWS resources and entire architectures.

## Benefits of using AWS CDK

- **Infrastructure as Code** - CDK uses code to define and provision your AWS resources
- **Familiar programming languages** - CDK supports TypeScript, Python, Java, and C#
- **Reusable components** - CDK allows you to define stacks and reuse them for different use cases
- **Speed and automation** - CDK makes it easy to spin up and tear down entire AWS environments with a single command

## Prerequisites

Before getting started with the AWS CDK v2 Typescript Playground, you need to have the following prerequisites installed on your local machine:

- [Amazon Web Services Account](https://aws.amazon.com/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with account that has Administrator access
- [Node.js 14.x](https://nodejs.org/en/download/) or above
- [AWS CDK Toolkit v2](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) configured

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
