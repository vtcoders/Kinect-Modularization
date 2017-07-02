using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

using Microsoft.Kinect;

namespace kinectModule
{
    public static class BodySerializer
    {
        // Definition of JSONSkeletonCollection class
        [DataContract]
        class JSONSkeletonCollection
        {
            [DataMember(Name = "skeletons")]
            public List<JSONSkeleton> Skeletons { get; set; }
        }

        // Definition of JSONSkeleton class
        [DataContract]
        class JSONSkeleton
        {
            [DataMember(Name = "id")]
            public string ID { get; set; }

            [DataMember(Name = "joints")]
            public List<JSONJoint> Joints { get; set; }
        }

        //Definition of JSONJoint class
        [DataContract]
        class JSONJoint
        {
            [DataMember(Name = "name")]
            public string Name { get; set; }

            [DataMember(Name = "x")]
            public double X { get; set; }

            [DataMember(Name = "y")]
            public double Y { get; set; }

            [DataMember(Name = "z")]
            public double Z { get; set; }
        }

        /**
         * Serializes an array of Kinect skeletons into an array of JSON skeletons
         * <param name = "skeletons"> The Kinect skeletons </param>
         * <param name = "mapper"> The coordinate mapper </param>
         * <param name = "mode"> Mode (color or depth) </param>
         * <return> A JSON representation of the skeletons </return>
         */
        public static string bodySerialize(this List<Body> skeletons, CoordinateMapper mapper, Mode mode)
        {
            //Initialize the skeleton collection
            JSONSkeletonCollection manyJsonSkeletons = new JSONSkeletonCollection { Skeletons = new List<JSONSkeleton>() };

            foreach (var skeleton in skeletons)
            {
                JSONSkeleton oneJsonSkeleton = new JSONSkeleton
                {
                    ID = skeleton.TrackingId.ToString(),
                    Joints = new List<JSONJoint>()
                };

                foreach (Joint joint in skeleton.Joints.Values)
                {
                    oneJsonSkeleton.Joints.Add(new JSONJoint
                    {
                        Name = joint.JointType.ToString(),
                        X = joint.Position.X,
                        Y = joint.Position.Y,
                        Z = joint.Position.Z
                    });
                }

                manyJsonSkeletons.Skeletons.Add(oneJsonSkeleton);
            }
            return serialize(manyJsonSkeletons);
        }   //end of bodySerialize

        /**
         * Serializes an object to JSON
         * <param name = "obj"> The speicified objec </param>
         * <return> A JSON representation of the object </return>
         */
        private static string serialize(object obj)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());

            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, obj);

                return Encoding.Default.GetString(ms.ToArray());
            }
        }
    }
}
