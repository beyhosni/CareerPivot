variable "aws_region" {
  default = "eu-west-3"
}

variable "environment" {
  default = "dev"
}

variable "project_name" {
  default = "careerpivot"
}

variable "db_password" {
  type      = string
  sensitive = true
}
