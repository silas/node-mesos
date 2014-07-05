# vi: set ft=ruby

Vagrant.configure('2') do |config|
  config.vm.box = 'playa_mesos_ubuntu_14.04'
  config.vm.box_url = "http://downloads.mesosphere.io/playa-mesos/#{config.vm.box}.box"

  config.vm.network :forwarded_port, :host => 8000, :guest => 8000

  config.vm.network :private_network, ip: ENV['VM_IP'] || '10.141.141.10'

  config.vm.provision :shell, inline: <<-eof
    set -o errexit
  eof

  config.vm.provider :virtualbox do |v|
    v.customize ['modifyvm', :id, '--cpus', ENV['VM_CPUS'] || '2']
    v.customize ['modifyvm', :id, '--memory', ENV['VM_MEMORY'] || 2048]
    v.customize ['modifyvm', :id, '--natdnshostresolver1', 'on']
    v.customize ['modifyvm', :id, '--natdnsproxy1', 'on']
    v.customize ['setextradata', :id, 'VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root', '1']
  end

  config.ssh.forward_agent = true
end
