provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CareerPivot"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Add local-exec or other providers if needed
