module "network" {
  source = "../../modules/network"

  project_name         = var.project_name
  environment          = var.environment
  cluster_name         = local.cluster_name
  availability_zones   = ["eu-west-3a", "eu-west-3b", "eu-west-3c"]
  public_subnets_cidr  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets_cidr = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
}

module "iam" {
  source = "../../modules/iam"

  project_name = var.project_name
  environment  = var.environment
}

module "ecr" {
  source = "../../modules/ecr"

  project_name = var.project_name
}

module "s3" {
  source = "../../modules/s3"

  project_name = var.project_name
  environment  = var.environment
}

module "eks" {
  source = "../../modules/eks"

  project_name     = var.project_name
  environment      = var.environment
  cluster_name     = local.cluster_name
  cluster_role_arn = module.iam.cluster_role_arn
  node_role_arn    = module.iam.node_role_arn
  subnet_ids       = module.network.private_subnet_ids
  instance_types   = ["t3.medium"]
  desired_capacity = 2
}

module "rds" {
  source = "../../modules/rds_postgres"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.network.vpc_id
  vpc_cidr     = "10.0.0.0/16"
  subnet_ids   = module.network.private_subnet_ids
  db_name      = "careerpivot_dev"
  db_username  = "admin"
  db_password  = var.db_password
}

module "redis" {
  source = "../../modules/redis"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.network.vpc_id
  vpc_cidr     = "10.0.0.0/16"
  subnet_ids   = module.network.private_subnet_ids
}

locals {
  cluster_name = "${var.project_name}-${var.environment}-eks"
}
