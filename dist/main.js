"use strict";
define("dependency.resolution/provider", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Provider {
        constructor(_dependencies, _resolver) {
            this._dependencies = _dependencies;
            this._resolver = _resolver;
            this._isSingleton = true;
        }
        static create(options, resolver) {
            const dependencies = Object.assign({}, options.dependencies);
            const provider = new Provider(dependencies, resolver);
            provider.applyOptionsFrom(options);
            return provider;
        }
        applyOptionsFrom(options) {
            if (typeof options.isSingleton === "boolean") {
                this._isSingleton = options.isSingleton;
            }
        }
        from(options) {
            const provider = new Provider(this._dependencies, this._resolver);
            provider.applyOptionsFrom(options);
            return provider;
        }
        get dependencies() {
            return Object.assign({}, this._dependencies);
        }
        get resolver() {
            return this._resolver;
        }
        get isSingleton() {
            return this._isSingleton;
        }
    }
    exports.default = Provider;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyIsIi4uL3NyYy9kZXBlbmRlbmN5LnJlc29sdXRpb24vcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQ3dCQSxNQUFxQixRQUFRO1FBTzNCLFlBQ21CLGFBQXFDLEVBQ3JDLFNBQW1CO1lBRG5CLGtCQUFhLEdBQWIsYUFBYSxDQUF3QjtZQUNyQyxjQUFTLEdBQVQsU0FBUyxDQUFVO1lBSjlCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBS3pCLENBQUM7UUFFRyxNQUFNLENBQUMsTUFBTSxDQUNsQixPQUEyRSxFQUMzRSxRQUdDO1lBRUQsTUFBTSxZQUFZLHFCQUFRLE9BQU8sQ0FBQyxZQUFZLENBQUUsQ0FBQztZQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FDM0IsWUFBWSxFQUNaLFFBQVEsQ0FDVCxDQUFDO1lBQ0YsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFFTyxnQkFBZ0IsQ0FBQyxPQUFxQztZQUM1RCxJQUFJLE9BQU8sT0FBTyxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUN6QztRQUNILENBQUM7UUFFTSxJQUFJLENBQUMsT0FBcUM7WUFDL0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQzNCLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxTQUFTLENBQ2YsQ0FBQztZQUNGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO1FBRUQsSUFBVyxZQUFZO1lBQ3JCLHlCQUFZLElBQUksQ0FBQyxhQUFhLEVBQUc7UUFDbkMsQ0FBQztRQUVELElBQVcsUUFBUTtZQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQztRQUVELElBQVcsV0FBVztZQUNwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDM0IsQ0FBQztLQUNGO0lBdERELDJCQXNEQyIsInNvdXJjZXNDb250ZW50IjpbIiIsInR5cGUgUHJvdmlkZXJEZXBlbmRlbmNpZXNCb3VuZCA9IFJlY29yZDxzdHJpbmcsIFByb3ZpZGVyPjtcclxuXHJcbnR5cGUgUHJvdmlkZXJEZXBlbmRlbmNpZXNSZXNvbHV0aW9uPERlcGVuZGVuY2llcz4gPVxyXG4gIERlcGVuZGVuY2llcyBleHRlbmRzIFByb3ZpZGVyRGVwZW5kZW5jaWVzQm91bmRcclxuICAgID8ge1xyXG4gICAgICAgIFtLIGluIGtleW9mIERlcGVuZGVuY2llc106IERlcGVuZGVuY2llc1tLXSBleHRlbmRzIFByb3ZpZGVyPGluZmVyIFI+XHJcbiAgICAgICAgICA/IFJcclxuICAgICAgICAgIDogbmV2ZXI7XHJcbiAgICAgIH1cclxuICAgIDogbmV2ZXI7XHJcblxyXG50eXBlIFByb3ZpZGVyUmVzb2x2ZXI8RGVwZW5kZW5jaWVzLCBQcm92aWRlPiA9IChcclxuICBkZXBlbmRlbmNpZXM6IERlcGVuZGVuY2llc1xyXG4pID0+IFByb3ZpZGUgfCBQcm9taXNlPFByb3ZpZGU+O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQcm92aWRlck9wdGlvbnNGcm9tIHtcclxuICAvKiogQGRlZmF1bHQgKi9cclxuICBpc1NpbmdsZXRvbjogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQcm92aWRlck9wdGlvbnNDcmVhdGU8RGVwZW5kZW5jaWVzPiB7XHJcbiAgZGVwZW5kZW5jaWVzOiBEZXBlbmRlbmNpZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyPFxyXG4gIF9Qcm92aWRlID0gYW55LFxyXG4gIERlcGVuZGVuY2llcyA9IGFueSxcclxuICBSZXNvbHZlciA9IGFueVxyXG4+IHtcclxuICBwcml2YXRlIF9pc1NpbmdsZXRvbiA9IHRydWU7XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9kZXBlbmRlbmNpZXM6IFJlYWRvbmx5PERlcGVuZGVuY2llcz4sXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9yZXNvbHZlcjogUmVzb2x2ZXJcclxuICApIHt9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlPFByb3ZpZGUsIERlcGVuZGVuY2llcyBleHRlbmRzIFByb3ZpZGVyRGVwZW5kZW5jaWVzQm91bmQ+KFxyXG4gICAgb3B0aW9uczogUHJvdmlkZXJPcHRpb25zQ3JlYXRlPERlcGVuZGVuY2llcz4gJiBQYXJ0aWFsPFByb3ZpZGVyT3B0aW9uc0Zyb20+LFxyXG4gICAgcmVzb2x2ZXI6IFByb3ZpZGVyUmVzb2x2ZXI8XHJcbiAgICAgIFByb3ZpZGVyRGVwZW5kZW5jaWVzUmVzb2x1dGlvbjxEZXBlbmRlbmNpZXM+LFxyXG4gICAgICBQcm92aWRlXHJcbiAgICA+XHJcbiAgKSB7XHJcbiAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSB7IC4uLm9wdGlvbnMuZGVwZW5kZW5jaWVzIH07XHJcbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBQcm92aWRlcjxQcm92aWRlLCBEZXBlbmRlbmNpZXMsIHR5cGVvZiByZXNvbHZlcj4oXHJcbiAgICAgIGRlcGVuZGVuY2llcyxcclxuICAgICAgcmVzb2x2ZXJcclxuICAgICk7XHJcbiAgICBwcm92aWRlci5hcHBseU9wdGlvbnNGcm9tKG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIHByb3ZpZGVyO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseU9wdGlvbnNGcm9tKG9wdGlvbnM6IFBhcnRpYWw8UHJvdmlkZXJPcHRpb25zRnJvbT4pIHtcclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5pc1NpbmdsZXRvbiA9PT0gXCJib29sZWFuXCIpIHtcclxuICAgICAgdGhpcy5faXNTaW5nbGV0b24gPSBvcHRpb25zLmlzU2luZ2xldG9uO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGZyb20ob3B0aW9uczogUGFydGlhbDxQcm92aWRlck9wdGlvbnNGcm9tPikge1xyXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXI8X1Byb3ZpZGUsIERlcGVuZGVuY2llcywgUmVzb2x2ZXI+KFxyXG4gICAgICB0aGlzLl9kZXBlbmRlbmNpZXMsXHJcbiAgICAgIHRoaXMuX3Jlc29sdmVyXHJcbiAgICApO1xyXG4gICAgcHJvdmlkZXIuYXBwbHlPcHRpb25zRnJvbShvcHRpb25zKTtcclxuICAgIHJldHVybiBwcm92aWRlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgZGVwZW5kZW5jaWVzKCkge1xyXG4gICAgcmV0dXJuIHsgLi4udGhpcy5fZGVwZW5kZW5jaWVzIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IHJlc29sdmVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Jlc29sdmVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBpc1NpbmdsZXRvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9pc1NpbmdsZXRvbjtcclxuICB9XHJcbn1cclxuIl19