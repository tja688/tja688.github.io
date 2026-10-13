export const config = /*json-start*/{
  "mainAssemblyName": "Pcd.Wasm.dll",
  "resources": {
    "hash": "sha256-pOUWKZ25Y0BvK0ugzMLOwdOpC0fhrSoLPnrKbgaQskg=",
    "jsModuleNative": [
      {
        "name": "dotnet.native.js"
      }
    ],
    "jsModuleRuntime": [
      {
        "name": "dotnet.runtime.js"
      }
    ],
    "wasmNative": [
      {
        "name": "dotnet.native.wasm",
        "hash": "sha256-41isUx9zl8P43Z47/obJJ6kekdE0ZbHOv+2+ZwULprc="
      }
    ],
    "coreAssembly": [
      {
        "virtualPath": "System.Private.CoreLib.wasm",
        "name": "System.Private.CoreLib.wasm",
        "hash": "sha256-D0Cfba+alEuXxAtKl2fZ157bTYIzAzDPHgz/QDf3ZDs="
      },
      {
        "virtualPath": "System.Runtime.InteropServices.JavaScript.wasm",
        "name": "System.Runtime.InteropServices.JavaScript.wasm",
        "hash": "sha256-15/x699PT+gUtpJC+57E+xMWXRyyyZmsE6xvnrx9rDQ="
      }
    ],
    "assembly": [
      {
        "virtualPath": "Pcd.Kernel.wasm",
        "name": "Pcd.Kernel.wasm",
        "hash": "sha256-hd1cMP0Liu1IVUdVcEZgHS0eMEF68++2CZ0TquQCH5c="
      },
      {
        "virtualPath": "Pcd.PlayHost.wasm",
        "name": "Pcd.PlayHost.wasm",
        "hash": "sha256-FB8dnnndcYTY677zYqNCpvj6e3JFzUnoZznuQzDm9jk="
      },
      {
        "virtualPath": "Pcd.Wasm.wasm",
        "name": "Pcd.Wasm.wasm",
        "hash": "sha256-PqLxVcBBJBGf7jvm3sEv9VIFzjpy7iq8/Pc7sIhFCUE="
      },
      {
        "virtualPath": "System.Collections.Concurrent.wasm",
        "name": "System.Collections.Concurrent.wasm",
        "hash": "sha256-vo3vojhX/304qr4AENVXZOeIE9kuDf81f5aIq5lCw7U="
      },
      {
        "virtualPath": "System.Collections.wasm",
        "name": "System.Collections.wasm",
        "hash": "sha256-Z9ReNd2e//fWnDcM/7douudtnA5H+Am6F9VxB5Kt+JA="
      },
      {
        "virtualPath": "System.IO.Pipelines.wasm",
        "name": "System.IO.Pipelines.wasm",
        "hash": "sha256-fZpB2NFmoDJXAqnCYU4+XAKkZbE51ViM3KsQ+bxqVOo="
      },
      {
        "virtualPath": "System.Memory.wasm",
        "name": "System.Memory.wasm",
        "hash": "sha256-wLl0G3X5wJZU3UOcsCrjIWMZV1dypmrr2oRJQ4arSmw="
      },
      {
        "virtualPath": "System.Security.Cryptography.wasm",
        "name": "System.Security.Cryptography.wasm",
        "hash": "sha256-llOHcZgnyTx1YCQBTVKzYQnD7k0TxM7xSO8XYX7rW/w="
      },
      {
        "virtualPath": "System.Text.Encodings.Web.wasm",
        "name": "System.Text.Encodings.Web.wasm",
        "hash": "sha256-PyauAfIJuLuboUhCG9VOXnJzPaCmm7k1v+zJPF0ZKbM="
      },
      {
        "virtualPath": "System.Text.Json.wasm",
        "name": "System.Text.Json.wasm",
        "hash": "sha256-6LiHXOUwsTxZc2yYaqScyQykIWApt0ENrX/kFWw/tP0="
      }
    ]
  },
  "debugLevel": 0,
  "globalizationMode": "invariant",
  "runtimeConfig": {
    "runtimeOptions": {
      "configProperties": {
        "Microsoft.Extensions.DependencyInjection.VerifyOpenGenericServiceTrimmability": true,
        "System.ComponentModel.DefaultValueAttribute.IsSupported": false,
        "System.ComponentModel.Design.IDesignerHost.IsSupported": false,
        "System.ComponentModel.TypeConverter.EnableUnsafeBinaryFormatterInDesigntimeLicenseContextSerialization": false,
        "System.ComponentModel.TypeDescriptor.IsComObjectDescriptorSupported": false,
        "System.Data.DataSet.XmlSerializationIsSupported": false,
        "System.Diagnostics.Debugger.IsSupported": false,
        "System.Diagnostics.Metrics.Meter.IsSupported": false,
        "System.Diagnostics.Tracing.EventSource.IsSupported": false,
        "System.Globalization.Invariant": true,
        "System.TimeZoneInfo.Invariant": false,
        "System.Globalization.PredefinedCulturesOnly": true,
        "System.Linq.Enumerable.IsSizeOptimized": true,
        "System.Net.Http.EnableActivityPropagation": false,
        "System.Net.Http.WasmEnableStreamingResponse": true,
        "System.Net.SocketsHttpHandler.Http3Support": false,
        "System.Reflection.Metadata.MetadataUpdater.IsSupported": false,
        "System.Resources.ResourceManager.AllowCustomResourceTypes": false,
        "System.Resources.UseSystemResourceKeys": true,
        "System.Runtime.CompilerServices.RuntimeFeature.IsDynamicCodeSupported": true,
        "System.Runtime.InteropServices.BuiltInComInterop.IsSupported": false,
        "System.Runtime.InteropServices.EnableConsumingManagedCodeFromNativeHosting": false,
        "System.Runtime.InteropServices.EnableCppCLIHostActivation": false,
        "System.Runtime.InteropServices.Marshalling.EnableGeneratedComInterfaceComImportInterop": false,
        "System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization": false,
        "System.StartupHookProvider.IsSupported": false,
        "System.Text.Encoding.EnableUnsafeUTF7Encoding": false,
        "System.Text.Json.JsonSerializer.IsReflectionEnabledByDefault": false,
        "System.Threading.Thread.EnableAutoreleasePool": false
      }
    }
  }
}/*json-end*/;