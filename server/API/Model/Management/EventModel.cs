﻿namespace API.Model.Management
{
    public class EventModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int Status { get; set; }
        public int Type { get; set; }
        public List<int> ProjectIds { get; set; }
    }
}
