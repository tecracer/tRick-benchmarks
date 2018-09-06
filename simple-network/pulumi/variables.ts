import { Config } from "@pulumi/pulumi";
import { Tags } from "@pulumi/aws";

let config = new Config("simple-network");
let awsconfig = new Config("aws");

export let region = awsconfig.require("region");
export let cidr_block = config.require("cidr_block");
export let subnet_cidr_block = config.require("subnet_cidr_block");
let tag_created_for: string = config.require("tag_created_for");
let tag_created_by: string = config.require("tag_created_by");
export let availability_zone: string = config.require("availability_zone");

export let tags: Tags = {
  "Created-For": tag_created_for,
  "Created-By": tag_created_by
};