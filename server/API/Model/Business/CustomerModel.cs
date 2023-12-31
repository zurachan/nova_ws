﻿namespace API.Model.Business
{
    public class CustomerModel
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public string Telephone { get; set; }

        public string Email { get; set; }

        public string? Address { get; set; }

        public int? ProjectId { get; set; }
    }
}
