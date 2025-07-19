export default function Footer() {
    return (
        <footer className="border-t bg-gray-100 shadow-md py-4 text-center w-[100%]">
            <div className="container mx-auto flex justify-start items-center gap-4">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} LetsBook. All rights reserved.
                </p>
                <p className="text-xs">
                    Made By Arpit Tripathi
                </p>
            </div>
        </footer>
    )
}