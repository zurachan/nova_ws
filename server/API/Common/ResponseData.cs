namespace API.Common
{
    public class ResponseData
    {
        private object _data;
        private object _dataOutput;
        private object _dataTotalValue;
        private bool _success;
        private string _message = string.Empty;
        private string _url = string.Empty;

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message
        {
            get { return _message; }
            set { _message = value; }
        }

        public string Url
        {
            get { return _url; }
            set { _url = value; }
        }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        /// <value>
        /// The data.
        /// </value>
        public object Data
        {
            get { return _data; }
            set { _data = value; }
        }

        public object DataOutput
        {
            get { return _dataOutput; }
            set { _dataOutput = value; }
        }

        public object DataTotalValue
        {
            get { return _dataTotalValue; }
            set { _dataTotalValue = value; }
        }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ResponseData"/> is success.
        /// </summary>
        /// <value>
        ///   <c>true</c> if success; otherwise, <c>false</c>.
        /// </value>
        public bool Success
        {
            get { return _success; }
            set { _success = value; }
        }
    }
}
