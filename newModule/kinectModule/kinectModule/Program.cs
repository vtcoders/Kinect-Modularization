using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

using Fleck;

using Microsoft.Kinect;

namespace kinectModule
{
    class Program
    {
        // Store the subsribed clients
        static List<IWebSocketConnection> clients = new List<IWebSocketConnection>();

        // Initialize the WebSocket server connection
        static Body[] bodies = new Body[6];

        static CoordinateMapper _coordinateMapper;
        static Mode _mode = Mode.Color;

        static void Main(string[] args)
        {
            // Initialize kinect
            KinectSensor kinectSensor = KinectSensor.GetDefault();

            BodyFrameReader bodyFrameReader = null;
            bodyFrameReader = kinectSensor.BodyFrameSource.OpenReader();

            ColorFrameReader colorFrameReader = null;
            colorFrameReader = kinectSensor.ColorFrameSource.OpenReader();

            _coordinateMapper = kinectSensor.CoordinateMapper;
            kinectSensor.Open();

            // Initialize WebSocket
            WebSocketServer server = new WebSocketServer("ws://127.0.0.1:8181");    // localhost = 127.0.0.1

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    // Add the incoming connection to our list
                    clients.Add(socket);
                    Console.WriteLine("Connection Open");
                };

                socket.OnClose = () =>
                {
                    // Remove the disconnected client from the list
                    clients.Remove(socket);
                    Console.WriteLine("Connection Closed");
                };


                socket.OnMessage = message =>
                {
                    if (message == "get-video")
                    {
                        Console.WriteLine("Get Video");
                        int NUMBER_OF_FRAMES = new DirectoryInfo("Video").GetFiles().Length;

                        // Send the video as a list of consecutive images
                        for (int index = 0; index < NUMBER_OF_FRAMES; index++)
                        {
                            foreach (var client in clients)
                            {
                                string path = "Video/" + index + ".jpg";
                                byte[] image = ImageUtil.ToByteArray(path);

                                client.Send(image);
                            }

                            // We send 30 frames per second, so sleep for 34 milliseconds
                            System.Threading.Thread.Sleep(340);
                        }
                    }
                    else if (message == "get-bodies")
                    {
                        Console.WriteLine("Get Bodies");
                        if (kinectSensor.IsOpen)
                        {
                            if (bodyFrameReader != null)
                            {
                                bodyFrameReader.FrameArrived += bodyFrameReader_FrameArrived;
                            }
                        }
                    }
                    else if (message == "get-color")
                    {
                        Console.WriteLine("get-color");
                        if (kinectSensor.IsOpen)
                        {
                            if (colorFrameReader != null)
                            {
                                colorFrameReader.FrameArrived += colorFrameReader_FrameArrived;
                            }
                        }
                    }
                    else
                    {
                        Console.WriteLine(message);
                    }
                };  //end of socket.OnMessage
            }); //end of server.Start

            //Wait for a key press for close...
            Console.ReadLine();
            kinectSensor.Close();
        }

        private static void colorFrameReader_FrameArrived(object sender, ColorFrameArrivedEventArgs e)
        {
            using (ColorFrame colorFrame = e.FrameReference.AcquireFrame())
            {
                if (colorFrame != null)
                {
                    var blob = colorFrame.serialize();

                    foreach (var client in clients)
                    {
                        if (blob != null)
                        {
                            client.Send(blob);
                            Console.WriteLine("After color Blob sent");
                        }
                    }
                }
            }
        }

        private static void bodyFrameReader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            bool dataReceived = false;

            using (BodyFrame bodyFrame = e.FrameReference.AcquireFrame())
            {
                if (bodyFrame != null)
                {
                    bodies = new Body[bodyFrame.BodyCount];
                }

                /**
                 * For Initial bodyFrame.GetAndRefreshBodyData(bodies),
                 * Kinect will allocate each Body in given array (i.e. bodies)
                 * Until diposed (i.e. bodies set to null)
                 * the body objects will be re-used
                **/
                bodyFrame.GetAndRefreshBodyData(bodies);
                dataReceived = true;
            }

            if (dataReceived)
            {
                foreach (var client in clients)
                {
                    var users = bodies.Where(s => s.IsTracked.Equals(true)).ToList();

                    if (users.Count > 0)
                    {
                        string json = users.bodySerialize(_coordinateMapper, _mode);

                        Console.WriteLine("jsonstring: " + json);
                        Console.WriteLine("After body serialization and to send");

                        client.Send(json);
                    }
                }
            }
        }   //end of bodyFrameReader_FrameArrived
    }   //end of class Program
}   //end of namespace kinectModule
