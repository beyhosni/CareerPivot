terraform {
  backend "s3" {
    bucket         = "careerpivot-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "eu-west-3"
    dynamodb_table = "careerpivot-terraform-locks"
    encrypt        = true
  }
}
# Note: Providers are normally defined in global, but for environments 
# we often re-include them or rely on inheriting.
provider "aws" {
  region = var.aws_region
}
